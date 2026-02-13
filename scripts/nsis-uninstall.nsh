!macro customUnInstall
  MessageBox MB_ICONQUESTION|MB_YESNO "Do you want to remove user data (settings and custom keys)?" IDYES removeUserData IDNO done
removeUserData:
  RMDir /r "$APPDATA\VibeCoding666"
  RMDir /r "$LOCALAPPDATA\VibeCoding666"
done:
!macroend
