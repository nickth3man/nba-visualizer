param(
  [string]$Root
)

$ErrorActionPreference = "Stop"

if (-not $Root) {
  $Root = Resolve-Path (Join-Path $PSScriptRoot "..")
} else {
  $Root = Resolve-Path $Root
}

$errors = New-Object "System.Collections.Generic.List[string]"

function Add-ValidationError {
  param([string]$Message)
  $script:errors.Add($Message) | Out-Null
}

function Read-JsonFile {
  param([string]$Path)
  try {
    return Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
  } catch {
    Add-ValidationError "Invalid JSON: $Path ($($_.Exception.Message))"
    return $null
  }
}

function Get-ObjectProperty {
  param(
    [object]$Object,
    [string]$Name
  )
  if ($null -eq $Object) {
    return $null
  }
  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) {
    return $null
  }
  return $property.Value
}

function Test-NonEmpty {
  param([object]$Value)
  return ($null -ne $Value -and "$Value".Trim().Length -gt 0)
}

function Test-ApprovalEntry {
  param(
    [object]$State,
    [string]$Phase,
    [string[]]$Actions
  )
  foreach ($entry in @($State.approval_history)) {
    if ($entry.phase -eq $Phase -and $Actions -contains $entry.action -and (Test-NonEmpty $entry.approved_at) -and (Test-NonEmpty $entry.approved_by)) {
      return $true
    }
  }
  return $false
}

$pipelinePath = Join-Path $Root "pipeline-state.json"
$tasksRoot = Join-Path $Root "tasks"
$phaseOrder = @("1-research", "2-plan", "3-implement", "4-review")
$validStatuses = @("pending", "in_progress", "ready_for_approval", "completed", "blocked", "skipped")
$terminalStatuses = @("completed", "skipped")
$outputByPhase = @{
  "1-research" = "1-research/findings.md"
  "2-plan" = "2-plan/plan.md"
  "3-implement" = "3-implement/tasks.md"
  "4-review" = "4-review/review.md"
}

if (-not (Test-Path -LiteralPath $pipelinePath -PathType Leaf)) {
  Add-ValidationError "Missing pipeline state: $pipelinePath"
} else {
  $pipeline = Read-JsonFile $pipelinePath
}

if ($null -ne $pipeline) {
  if (-not (Test-NonEmpty $pipeline.active_task)) {
    Add-ValidationError "pipeline-state.json is missing active_task."
  }
  if ($null -eq $pipeline.tasks) {
    Add-ValidationError "pipeline-state.json is missing tasks."
  } else {
    $taskProperties = @($pipeline.tasks.PSObject.Properties)
    if ($taskProperties.Count -eq 0) {
      Add-ValidationError "pipeline-state.json has no tasks."
    }
    if ($taskProperties.Name -notcontains $pipeline.active_task) {
      Add-ValidationError "active_task '$($pipeline.active_task)' is not listed in pipeline tasks."
    }

    foreach ($taskProperty in $taskProperties) {
      $taskId = $taskProperty.Name
      $taskInfo = $taskProperty.Value
      if ($taskId -notmatch "^[a-z0-9][a-z0-9-]*$") {
        Add-ValidationError "Task id '$taskId' does not match the required pattern."
      }
      if (-not (Test-NonEmpty $taskInfo.description)) {
        Add-ValidationError "Task '$taskId' is missing a description in pipeline-state.json."
      }
      if (-not (Test-NonEmpty $taskInfo.created_at)) {
        Add-ValidationError "Task '$taskId' is missing created_at in pipeline-state.json."
      }

      $taskDir = Join-Path $tasksRoot $taskId
      $statePath = Join-Path $taskDir "state.json"
      if (-not (Test-Path -LiteralPath $statePath -PathType Leaf)) {
        Add-ValidationError "Task '$taskId' is missing state.json."
        continue
      }

      $state = Read-JsonFile $statePath
      if ($null -eq $state) {
        continue
      }

      if ($state.schema_version -ne "1.0") {
        Add-ValidationError "Task '$taskId' has unsupported schema_version '$($state.schema_version)'."
      }
      if ($state.task_id -ne $taskId) {
        Add-ValidationError "Task '$taskId' state task_id is '$($state.task_id)'."
      }
      if ($state.description -ne $taskInfo.description) {
        Add-ValidationError "Task '$taskId' description differs between pipeline-state.json and state.json."
      }
      if ($phaseOrder -notcontains $state.current_phase) {
        Add-ValidationError "Task '$taskId' current_phase '$($state.current_phase)' is invalid."
      }
      if ($null -eq $state.approval_history) {
        Add-ValidationError "Task '$taskId' is missing approval_history."
      }

      $currentIndex = [Array]::IndexOf($phaseOrder, $state.current_phase)
      $allTerminal = $true

      for ($i = 0; $i -lt $phaseOrder.Count; $i++) {
        $phaseName = $phaseOrder[$i]
        $phase = Get-ObjectProperty $state.phases $phaseName
        if ($null -eq $phase) {
          Add-ValidationError "Task '$taskId' is missing phase '$phaseName'."
          $allTerminal = $false
          continue
        }

        $status = $phase.status
        if ($validStatuses -notcontains $status) {
          Add-ValidationError "Task '$taskId' phase '$phaseName' has invalid status '$status'."
          $allTerminal = $false
          continue
        }

        if ($terminalStatuses -notcontains $status) {
          $allTerminal = $false
        }

        if ($status -eq "in_progress" -and -not (Test-NonEmpty $phase.started_at)) {
          Add-ValidationError "Task '$taskId' phase '$phaseName' is in_progress without started_at."
        }
        if ($status -eq "blocked") {
          if (-not (Test-NonEmpty $phase.started_at)) {
            Add-ValidationError "Task '$taskId' phase '$phaseName' is blocked without started_at."
          }
          if (-not (Test-NonEmpty $phase.blocked_reason)) {
            Add-ValidationError "Task '$taskId' phase '$phaseName' is blocked without blocked_reason."
          }
        }
        if ($status -eq "ready_for_approval" -or $status -eq "completed") {
          if (-not (Test-NonEmpty $phase.started_at)) {
            Add-ValidationError "Task '$taskId' phase '$phaseName' is $status without started_at."
          }
          if (-not (Test-NonEmpty $phase.ready_at)) {
            Add-ValidationError "Task '$taskId' phase '$phaseName' is $status without ready_at."
          }
          if (-not (Test-NonEmpty $phase.output_file)) {
            Add-ValidationError "Task '$taskId' phase '$phaseName' is $status without output_file."
          } else {
            $expectedSuffix = ".agents/tasks/$taskId/$($outputByPhase[$phaseName])"
            if ($phase.output_file -ne $expectedSuffix) {
              Add-ValidationError "Task '$taskId' phase '$phaseName' output_file should be '$expectedSuffix', found '$($phase.output_file)'."
            }
            $outputPath = Join-Path (Split-Path $Root -Parent) $phase.output_file
            if (-not (Test-Path -LiteralPath $outputPath -PathType Leaf)) {
              Add-ValidationError "Task '$taskId' phase '$phaseName' output_file does not exist: $($phase.output_file)."
            }
          }
        }
        if ($status -eq "completed") {
          foreach ($field in @("completed_at", "approved_at", "approved_by")) {
            if (-not (Test-NonEmpty (Get-ObjectProperty $phase $field))) {
              Add-ValidationError "Task '$taskId' phase '$phaseName' is completed without $field."
            }
          }
          $expectedActions = if ($phaseName -eq "4-review") { @("complete") } else { @("advance") }
          if (-not (Test-ApprovalEntry $state $phaseName $expectedActions)) {
            Add-ValidationError "Task '$taskId' phase '$phaseName' is completed without matching approval_history action '$($expectedActions -join '/')'."
          }
        }
        if ($status -eq "skipped") {
          foreach ($field in @("completed_at", "approved_at", "approved_by", "skip_reason")) {
            if (-not (Test-NonEmpty (Get-ObjectProperty $phase $field))) {
              Add-ValidationError "Task '$taskId' phase '$phaseName' is skipped without $field."
            }
          }
          if (-not (Test-ApprovalEntry $state $phaseName @("skip"))) {
            Add-ValidationError "Task '$taskId' phase '$phaseName' is skipped without matching approval_history action 'skip'."
          }
        }
      }

      if ($allTerminal) {
        $reviewPhase = Get-ObjectProperty $state.phases "4-review"
        if ($state.current_phase -ne "4-review" -or $reviewPhase.status -ne "completed") {
          Add-ValidationError "Completed task '$taskId' must keep current_phase at 4-review with 4-review completed."
        }
      } elseif ($currentIndex -ge 0) {
        for ($i = 0; $i -lt $phaseOrder.Count; $i++) {
          $phaseName = $phaseOrder[$i]
          $phase = Get-ObjectProperty $state.phases $phaseName
          if ($null -eq $phase) {
            continue
          }
          if ($i -lt $currentIndex -and $terminalStatuses -notcontains $phase.status) {
            Add-ValidationError "Task '$taskId' has phase '$phaseName' before current_phase that is not completed or skipped."
          }
          if ($i -eq $currentIndex -and $phase.status -eq "pending") {
            Add-ValidationError "Task '$taskId' current_phase '$phaseName' is pending."
          }
          if ($i -gt $currentIndex -and $phase.status -ne "pending") {
            Add-ValidationError "Task '$taskId' has future phase '$phaseName' with status '$($phase.status)' instead of pending."
          }
        }
      }
    }
  }
}

if ($errors.Count -gt 0) {
  Write-Host "Pipeline validation failed:" -ForegroundColor Red
  foreach ($validationError in $errors) {
    Write-Host " - $validationError" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Pipeline validation passed." -ForegroundColor Green
