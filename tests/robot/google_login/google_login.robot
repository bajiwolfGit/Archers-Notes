*** Settings ***
Documentation    Tests Google OAuth login initiation.
Library          Browser

*** Test Cases ***
User Can Start Google Login
    New Browser    chromium    headless=True
    New Page    http://localhost:3000/

    Click    text=Continue with Google

    Wait For Condition    url    contains   accounts.google.com

    Get Url    contains    accounts.google.com

    Close Browser
