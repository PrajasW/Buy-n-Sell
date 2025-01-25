const Item = require("../Schema/Item");
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const item
        = await Item.findById(id);
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
