import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;
app.get("/health", (req, res) => {
    // res.status(200).json({message: "All good"});
    // res.send("Hey! I am healthy");
})


app.listen(PORT, () => console.log(`Server is listening on ${PORT}`))