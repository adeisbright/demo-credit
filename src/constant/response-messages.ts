const responseMessages = {
    serverUp: "App is up and running on Configured port ", 
    mongoConnect: "Connected to MongoDB Database", 
    mongoTerminate: "MongoDB terminated. Process ended", 
    apiHealth: "App is Healthy and Running Fine",
    serverError: "ERROR 500 : INTERNAL SERVER ERROR",
    authHeaderNeeded: "Provide Authorization Header",
    invalidAuth: "Bad Request  :Invalid Authorization",
    authExpired: "Please, login again. Session Expired",
    userExist: "Another user exists with this email",
    emailVerificationSent: "We have sent an email to the account you provided",
    emailVerified: "Email Verification Successful",
    invalidReference: "Invalid Reference",
    linkExpired: "Link has expire",
    invalidLogin: "Invalid Login Credentials",
    correctLogin : "Login successfully",
}



export default responseMessages;
