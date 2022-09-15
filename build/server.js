import express from 'express';
const app = express();
app.get('/', () => {
    console.log('teste');
});
app.listen(3333);
