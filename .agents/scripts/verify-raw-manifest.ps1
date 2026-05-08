param(
  [string]$Root,
  [string]$ManifestPath
)

$ErrorActionPreference = "Stop"

if (-not $Root) {
  $Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
} else {
  $Root = Resolve-Path $Root
}

if (-not $ManifestPath) {
  $ManifestPath = Join-Path $Root ".agents\raw-data-manifest.md"
} else {
  $ManifestPath = Resolve-Path $ManifestPath
}

$rawRoot = Join-Path $Root "raw"
$errors = New-Object "System.Collections.Generic.List[string]"

function Add-ValidationError {
  param([string]$Message)
  $script:errors.Add($Message) | Out-Null
}

function Normalize-RelativePath {
  param([string]$Path)
  return $Path.Replace("\", "/").TrimStart("./")
}

function Get-SectionLines {
  param(
    [string[]]$Lines,
    [string]$Heading
  )

  $start = -1
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -eq $Heading) {
      $start = $i + 1
      break
    }
  }

  if ($start -lt 0) {
    Add-ValidationError "Missing manifest section: $Heading"
    return @()
  }

  $section = New-Object "System.Collections.Generic.List[string]"
  for ($i = $start; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -match "^##\s+" -and $Lines[$i] -ne $Heading) {
      break
    }
    $section.Add($Lines[$i]) | Out-Null
  }

  return @($section)
}

function Parse-SourceSummaries {
  param([string[]]$Lines)

  $summaries = @{}
  foreach ($line in $Lines) {
    if ($line -match '^\|\s*`raw/(?<source>[^/]+)/`\s*\|\s*(?<count>\d+)\s*\|\s*(?<bytes>\d+)\s*\|') {
      $source = $Matches.source
      if ($summaries.ContainsKey($source)) {
        Add-ValidationError "Duplicate source summary for raw/$source."
      }
      $summaries[$source] = [PSCustomObject]@{
        Source = $source
        FileCount = [int]$Matches.count
        TotalBytes = [int64]$Matches.bytes
      }
    }
  }

  if ($summaries.Count -eq 0) {
    Add-ValidationError "No source summaries parsed from manifest."
  }
  return $summaries
}

function Parse-CompleteInventory {
  param([string[]]$Lines)

  $inventory = @{}
  foreach ($line in $Lines) {
    if ($line -match '^\|\s*`(?<path>raw/[^`]+)`\s*\|\s*(?<bytes>\d+)\s*\|\s*(?<source>[^|]+?)\s*\|') {
      $path = Normalize-RelativePath $Matches.path
      $source = $Matches.source.Trim()
      if ($inventory.ContainsKey($path)) {
        Add-ValidationError "Duplicate raw file inventory path: $path"
        continue
      }
      $inventory[$path] = [PSCustomObject]@{
        Path = $path
        Bytes = [int64]$Matches.bytes
        Source = $source
      }
    }
  }

  if ($inventory.Count -eq 0) {
    Add-ValidationError "No complete raw file inventory rows parsed from manifest."
  }
  return $inventory
}

function Parse-CriticalFiles {
  param([string[]]$Lines)

  $critical = New-Object "System.Collections.Generic.List[string]"
  foreach ($line in $Lines) {
    if ($line -match '^\|\s*`(?<path>raw/[^`]+)`\s*\|') {
      $critical.Add((Normalize-RelativePath $Matches.path)) | Out-Null
    }
  }
  return @($critical)
}

if (-not (Test-Path -LiteralPath $ManifestPath -PathType Leaf)) {
  Add-ValidationError "Missing raw data manifest: $ManifestPath"
} else {
  $manifestLines = @(Get-Content -LiteralPath $ManifestPath)
  $sourceSummaryLines = Get-SectionLines $manifestLines "## Expected Top-Level Sources"
  $inventoryLines = Get-SectionLines $manifestLines "## Complete Raw File Inventory"
  $criticalLines = Get-SectionLines $manifestLines "## Critical Files"
  $sourceSummaries = Parse-SourceSummaries $sourceSummaryLines
  $inventory = Parse-CompleteInventory $inventoryLines
  $criticalFiles = Parse-CriticalFiles $criticalLines
}

if (-not (Test-Path -LiteralPath $rawRoot -PathType Container)) {
  Add-ValidationError "Missing raw directory: $rawRoot"
} else {
  $actualFiles = @{}
  foreach ($file in @(Get-ChildItem -LiteralPath $rawRoot -Recurse -Force -File -ErrorAction SilentlyContinue)) {
    $relative = Resolve-Path -LiteralPath $file.FullName -Relative
    $path = Normalize-RelativePath $relative
    if ($actualFiles.ContainsKey($path)) {
      Add-ValidationError "Duplicate actual raw path after normalization: $path"
      continue
    }
    $actualFiles[$path] = [PSCustomObject]@{
      Path = $path
      Bytes = [int64]$file.Length
      FullName = $file.FullName
    }
  }

  if ($null -ne $sourceSummaries) {
    $actualDirs = @(Get-ChildItem -LiteralPath $rawRoot -Force -Directory | Select-Object -ExpandProperty Name)
    foreach ($source in $sourceSummaries.Keys) {
      if ($actualDirs -notcontains $source) {
        Add-ValidationError "Missing expected raw source directory: raw/$source"
      }
    }
    foreach ($dir in $actualDirs) {
      if (-not $sourceSummaries.ContainsKey($dir)) {
        Add-ValidationError "Unexpected raw source directory: raw/$dir"
      }
    }
  }

  if ($null -ne $inventory) {
    foreach ($path in $inventory.Keys) {
      $item = $inventory[$path]
      if (-not $actualFiles.ContainsKey($path)) {
        Add-ValidationError "Manifest lists missing raw file: $path"
        continue
      }

      if ($actualFiles[$path].Bytes -ne $item.Bytes) {
        Add-ValidationError "Raw file byte mismatch for ${path}: manifest $($item.Bytes), actual $($actualFiles[$path].Bytes)."
      }

      $sourceFromPath = $path.Split("/")[1]
      if ($item.Source -ne $sourceFromPath) {
        Add-ValidationError "Raw file source mismatch for ${path}: manifest '$($item.Source)', path source '$sourceFromPath'."
      }
    }

    foreach ($path in $actualFiles.Keys) {
      if (-not $inventory.ContainsKey($path)) {
        Add-ValidationError "Actual raw file missing from manifest inventory: $path"
      }
    }

    foreach ($criticalFile in @($criticalFiles)) {
      if (-not $inventory.ContainsKey($criticalFile)) {
        Add-ValidationError "Critical raw file is not listed in complete inventory: $criticalFile"
      }
      if (-not $actualFiles.ContainsKey($criticalFile)) {
        Add-ValidationError "Missing critical raw file: $criticalFile"
      }
    }

    if ($null -ne $sourceSummaries) {
      $inventoryBySource = @{}
      foreach ($item in $inventory.Values) {
        if (-not $inventoryBySource.ContainsKey($item.Source)) {
          $inventoryBySource[$item.Source] = [PSCustomObject]@{
            Count = 0
            Bytes = [int64]0
          }
        }
        $inventoryBySource[$item.Source].Count += 1
        $inventoryBySource[$item.Source].Bytes += $item.Bytes
      }

      foreach ($source in $sourceSummaries.Keys) {
        if (-not $inventoryBySource.ContainsKey($source)) {
          Add-ValidationError "Source summary raw/$source has no complete inventory rows."
          continue
        }

        if ($inventoryBySource[$source].Count -ne $sourceSummaries[$source].FileCount) {
          Add-ValidationError "Source raw/$source manifest count mismatch: summary $($sourceSummaries[$source].FileCount), inventory $($inventoryBySource[$source].Count)."
        }

        if ($inventoryBySource[$source].Bytes -ne $sourceSummaries[$source].TotalBytes) {
          Add-ValidationError "Source raw/$source manifest byte mismatch: summary $($sourceSummaries[$source].TotalBytes), inventory $($inventoryBySource[$source].Bytes)."
        }
      }

      foreach ($source in $inventoryBySource.Keys) {
        if (-not $sourceSummaries.ContainsKey($source)) {
          Add-ValidationError "Complete inventory source raw/$source is missing from source summaries."
        }
      }
    }
  }
}

if ($errors.Count -gt 0) {
  Write-Host "Raw manifest verification failed:" -ForegroundColor Red
  foreach ($validationError in $errors) {
    Write-Host " - $validationError" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Raw manifest verification passed. $($inventory.Count) files accounted for." -ForegroundColor Green
