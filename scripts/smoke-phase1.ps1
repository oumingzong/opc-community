param(
  [string]$BaseUrl = "http://127.0.0.1:3000"
)

$ErrorActionPreference = "Stop"

function Invoke-JsonGet {
  param(
    [string]$Url
  )

  try {
    return Invoke-RestMethod -Method Get -Uri $Url -TimeoutSec 20
  } catch {
    throw "GET $Url failed: $($_.Exception.Message)"
  }
}

function Assert-HasValue {
  param(
    [Parameter(Mandatory = $true)] [object]$Value,
    [Parameter(Mandatory = $true)] [string]$Name
  )

  if ($null -eq $Value -or $Value -eq "") {
    throw "Assertion failed: $Name is empty"
  }
}

Write-Host "[phase1] base url: $BaseUrl"

$resourceSpecs = @(
  @{ Name = "ai-news"; ListPath = "/api/ai-news?page=1&pageSize=2"; DetailPath = "/api/ai-news/{slug}" },
  @{ Name = "collaboration"; ListPath = "/api/collaboration?page=1&pageSize=2"; DetailPath = "/api/collaboration/{slug}" },
  @{ Name = "offline-events"; ListPath = "/api/offline-events?page=1&pageSize=2"; DetailPath = "/api/offline-events/{slug}" },
  @{ Name = "tech-resources"; ListPath = "/api/tech-resources?page=1&pageSize=2"; DetailPath = "/api/tech-resources/{slug}" }
)

foreach ($spec in $resourceSpecs) {
  $listUrl = "$BaseUrl$($spec.ListPath)"
  $listResp = Invoke-JsonGet -Url $listUrl

  Assert-HasValue -Value $listResp.page -Name "$($spec.Name).page"
  Assert-HasValue -Value $listResp.pageSize -Name "$($spec.Name).pageSize"
  Assert-HasValue -Value $listResp.total -Name "$($spec.Name).total"

  if ($null -eq $listResp.items) {
    throw "Assertion failed: $($spec.Name).items missing"
  }

  $dataSource = $listResp.dataSource
  if ($dataSource -ne "default" -and $dataSource -ne "api" -and $dataSource -ne "fallback") {
    throw "Assertion failed: $($spec.Name).dataSource invalid => $dataSource"
  }

  Write-Host "[ok] $($spec.Name) list => total=$($listResp.total), dataSource=$dataSource"

  if ($listResp.items.Count -gt 0) {
    $slug = $listResp.items[0].slug
    Assert-HasValue -Value $slug -Name "$($spec.Name).items[0].slug"

    $detailUrl = "$BaseUrl$($spec.DetailPath.Replace('{slug}', $slug))"
    $detailResp = Invoke-JsonGet -Url $detailUrl

    Assert-HasValue -Value $detailResp.id -Name "$($spec.Name).detail.id"
    Assert-HasValue -Value $detailResp.slug -Name "$($spec.Name).detail.slug"

    Write-Host "[ok] $($spec.Name) detail => slug=$($detailResp.slug)"
  } else {
    Write-Host "[skip] $($spec.Name) detail => no items in list"
  }
}

Write-Host "[phase1] smoke passed"
