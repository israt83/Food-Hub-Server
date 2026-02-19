import app from "./app";


const PROT = process.env.PORT || 4000;

async function server() {
    
    app.listen(PROT, () => {
        console.log(`Server running on port ${PROT}`);
    });
}

server();