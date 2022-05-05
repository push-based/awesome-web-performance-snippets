#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; Executed by pressing WIN + n. 
; The mouse should be over the "Quick Source" of the performance tab before
#n::

MouseGetPos, xpos, ypos 

; Start recording and wait 500ms
Send ^E
Sleep 500

; Click mouse and press CTRL + Enter multiple times
Loop 6 {
    Click, xpos ypos

    Send ^{Enter}

    Sleep 1000
}

Send ^E ; Stop recording
Return
