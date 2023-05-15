const responseMessages = {
    serverUp: "App is up and running on Configured port ", 
    mongoConnect: "Connected to MongoDB Database", 
    mongoTerminate: "MongoDB terminated. Process ended", 
    apiHealth: "App is Healthy and Running Fine",
    serverError: "ERROR 500 : INTERNAL SERVER ERROR",
    authHeaderNeeded: "Provide Authorization Header",
    invalidAuth: "Bad Request  :Invalid Authorization",
    authExpired: "Please, login again. Session Expired"  
}



export default responseMessages;
