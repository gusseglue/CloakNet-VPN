; CloakNet VPN Custom Installer Script
; This script handles WireGuard installation during the CloakNet VPN setup

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"

; Variables
Var WireGuardInstalled

; Macro to check if WireGuard is installed
!macro CheckWireGuard
  ClearErrors
  ReadRegStr $0 HKLM "SOFTWARE\WireGuard" ""
  ${If} ${Errors}
    ; Try 64-bit registry
    SetRegView 64
    ClearErrors
    ReadRegStr $0 HKLM "SOFTWARE\WireGuard" ""
    SetRegView 32
  ${EndIf}
  ${If} ${Errors}
    StrCpy $WireGuardInstalled "0"
  ${Else}
    StrCpy $WireGuardInstalled "1"
  ${EndIf}
!macroend

; Custom install section for WireGuard
!macro customInstall
  ; Check if WireGuard is already installed
  !insertmacro CheckWireGuard
  
  ${If} $WireGuardInstalled == "0"
    ; WireGuard not found, install it
    DetailPrint "Installing WireGuard..."
    
    ; Extract WireGuard MSI to temp
    SetOutPath "$TEMP\CloakNetInstall"
    File /oname=wireguard-installer.msi "${BUILD_RESOURCES_DIR}\wireguard\wireguard-amd64.msi"
    
    ; Install WireGuard silently
    DetailPrint "Running WireGuard installer..."
    nsExec::ExecToLog 'msiexec /i "$TEMP\CloakNetInstall\wireguard-installer.msi" /qn /norestart'
    Pop $0
    
    ${If} $0 != "0"
      DetailPrint "Note: WireGuard installation returned code $0"
      ; Don't fail - user might have it installed elsewhere
    ${EndIf}
    
    ; Clean up
    Delete "$TEMP\CloakNetInstall\wireguard-installer.msi"
    RMDir "$TEMP\CloakNetInstall"
    
    DetailPrint "WireGuard installation complete"
  ${Else}
    DetailPrint "WireGuard is already installed"
  ${EndIf}
!macroend

; Custom uninstall section - don't remove WireGuard (user might need it)
!macro customUnInstall
  ; We don't uninstall WireGuard as other applications might depend on it
  DetailPrint "CloakNet VPN has been uninstalled"
  DetailPrint "Note: WireGuard was not removed as it may be used by other applications"
!macroend
