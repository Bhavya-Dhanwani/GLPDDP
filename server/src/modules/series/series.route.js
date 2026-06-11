import express from 'expr'
const router = express.Router();

router.get("/", async (req, res) => {
    res.send("Series route");
});

export default router;