import app from "./app"

const PORT : number = 4500 
app.listen(PORT, () =>
    console.log(`Started at localhost:${PORT}`)
);