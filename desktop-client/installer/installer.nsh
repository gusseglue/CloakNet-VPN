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

; WireGuard download URL - official download from wireguard.com
!define WIREGUARD_URL "https://download.wireguard.com/windows-client/wireguard-installer.exe"
!define WIREGUARD_INSTALLER "$TEMP\wireguard-installer.exe"
!define DOWNLOAD_SCRIPT "$TEMP\download_wireguard.ps1"

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
    
    ; Create PowerShell download script
    FileOpen $0 "${DOWNLOAD_SCRIPT}" w
    FileWrite $0 "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12$\r$\n"
    FileWrite $0 "try {$\r$\n"
    FileWrite $0 "    Invoke-WebRequest -Uri '${WIREGUARD_URL}' -OutFile '${WIREGUARD_INSTALLER}' -UseBasicParsing$\r$\n"
    FileWrite $0 "    exit 0$\r$\n"
    FileWrite $0 "} catch {$\r$\n"
    FileWrite $0 "    exit 1$\r$\n"
    FileWrite $0 "}$\r$\n"
    FileClose $0
    
    ; Run the download script
    DetailPrint "Downloading WireGuard from official source..."
    ExecWait 'powershell.exe -ExecutionPolicy Bypass -File "${DOWNLOAD_SCRIPT}"' $0
    
    ; Clean up download script
    Delete "${DOWNLOAD_SCRIPT}"
    
    ; Check download exit code and verify file exists
    ${If} $0 != "0"
      DetailPrint "Download script failed with exit code: $0"
    ${EndIf}
    
    ; Check if file was downloaded successfully
    ${If} ${FileExists} "${WIREGUARD_INSTALLER}"
      DetailPrint "Download complete. Installing WireGuard..."
      
      ; Run WireGuard installer silently and wait for completion
      ExecWait '"${WIREGUARD_INSTALLER}" /S' $0
      
      ; WireGuard installer runs in background - wait for it to register files and services
      ; 3 seconds allows the installer to fully complete before we check for wg.exe
      Sleep 3000
      
      ; Verify installation was successful
      !insertmacro CheckWireGuard
      ${If} $WireGuardInstalled == "1"
        DetailPrint "WireGuard installed successfully!"
      ${Else}
        DetailPrint "WireGuard installation may have failed (exit code: $0)"
        MessageBox MB_OK|MB_ICONINFORMATION "WireGuard installation may not have completed successfully.$\n$\nPlease verify WireGuard is installed from:$\nhttps://www.wireguard.com/install/$\n$\nCloakNet VPN will continue to install."
      ${EndIf}
      
      ; Clean up installer
      Delete "${WIREGUARD_INSTALLER}"
    ${Else}
      DetailPrint "Download failed - WireGuard installer not found"
      MessageBox MB_OK|MB_ICONINFORMATION "Could not download WireGuard automatically.$\n$\nPlease install WireGuard manually from:$\nhttps://www.wireguard.com/install/$\n$\nCloakNet VPN will continue to install."
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
