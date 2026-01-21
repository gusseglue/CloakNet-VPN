; CloakNet VPN Custom Installer Script
; This script handles WireGuard installation during the CloakNet VPN setup

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"
!include "x64.nsh"
!include "FileFunc.nsh"

; Variables
Var WireGuardInstalled
Var WireGuardExe
Var DownloadResult

; WireGuard download URL - official download from wireguard.com
!define WIREGUARD_URL "https://download.wireguard.com/windows-client/wireguard-installer.exe"
!define WIREGUARD_INSTALLER "$TEMP\wireguard-installer.exe"

; Macro to check if WireGuard is installed
!macro CheckWireGuard
  ; Check if wg.exe exists in Program Files
  StrCpy $WireGuardInstalled "0"
  
  ; Check 64-bit location
  ${If} ${FileExists} "$PROGRAMFILES64\WireGuard\wg.exe"
    StrCpy $WireGuardInstalled "1"
    StrCpy $WireGuardExe "$PROGRAMFILES64\WireGuard\wg.exe"
  ${EndIf}
  
  ; Check 32-bit location
  ${If} $WireGuardInstalled == "0"
    ${If} ${FileExists} "$PROGRAMFILES\WireGuard\wg.exe"
      StrCpy $WireGuardInstalled "1"
      StrCpy $WireGuardExe "$PROGRAMFILES\WireGuard\wg.exe"
    ${EndIf}
  ${EndIf}
  
  ; Also check registry as backup
  ${If} $WireGuardInstalled == "0"
    ClearErrors
    SetRegView 64
    ReadRegStr $0 HKLM "SOFTWARE\WireGuard" ""
    ${IfNot} ${Errors}
      StrCpy $WireGuardInstalled "1"
    ${EndIf}
    SetRegView 32
  ${EndIf}
!macroend

; Custom install section for WireGuard
!macro customInstall
  ; Check if WireGuard is already installed
  !insertmacro CheckWireGuard
  
  ${If} $WireGuardInstalled == "0"
    ; WireGuard not found, download and install it
    DetailPrint "WireGuard is not installed. Downloading..."
    
    ; Use PowerShell to download WireGuard (works on all modern Windows)
    DetailPrint "Downloading WireGuard from official source..."
    nsExec::ExecToLog 'powershell -ExecutionPolicy Bypass -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri \"${WIREGUARD_URL}\" -OutFile \"${WIREGUARD_INSTALLER}\" -UseBasicParsing; exit 0 } catch { exit 1 }"'
    Pop $DownloadResult
    
    ${If} $DownloadResult == "0"
      ; Check if file was downloaded
      ${If} ${FileExists} "${WIREGUARD_INSTALLER}"
        DetailPrint "Download complete. Installing WireGuard..."
        
        ; Run WireGuard installer silently
        nsExec::ExecToLog '"${WIREGUARD_INSTALLER}" /S'
        Pop $0
        
        ${If} $0 == "0"
          DetailPrint "WireGuard installed successfully!"
        ${Else}
          ; Try with ExecWait as fallback
          DetailPrint "Trying alternative installation method..."
          ExecWait '"${WIREGUARD_INSTALLER}" /S' $0
          ${If} $0 == "0"
            DetailPrint "WireGuard installed successfully!"
          ${Else}
            DetailPrint "Automatic installation returned code: $0"
            MessageBox MB_OK|MB_ICONINFORMATION "WireGuard could not be installed automatically.$\n$\nPlease install WireGuard manually from:$\nhttps://www.wireguard.com/install/$\n$\nCloakNet VPN will continue to install."
          ${EndIf}
        ${EndIf}
        
        ; Clean up
        Delete "${WIREGUARD_INSTALLER}"
      ${Else}
        DetailPrint "Download failed - file not found"
        MessageBox MB_OK|MB_ICONINFORMATION "Could not download WireGuard.$\n$\nPlease install WireGuard manually from:$\nhttps://www.wireguard.com/install/$\n$\nCloakNet VPN will continue to install."
      ${EndIf}
    ${Else}
      DetailPrint "Download failed with code: $DownloadResult"
      MessageBox MB_OK|MB_ICONINFORMATION "Could not download WireGuard (network error).$\n$\nPlease install WireGuard manually from:$\nhttps://www.wireguard.com/install/$\n$\nCloakNet VPN will continue to install."
    ${EndIf}
    
  ${Else}
    DetailPrint "WireGuard is already installed at: $WireGuardExe"
  ${EndIf}
!macroend

; Custom uninstall section - don't remove WireGuard (user might need it)
!macro customUnInstall
  ; We don't uninstall WireGuard as other applications might depend on it
  DetailPrint "CloakNet VPN has been uninstalled"
  DetailPrint "Note: WireGuard was not removed as it may be used by other applications"
!macroend
