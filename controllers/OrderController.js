const Project = require('../models/Project');

// Получение всех свободных заказов
exports.getAllFreeOrders = async (req, res) => {
    try {
        const orders = await Project.find({ freelancerId: null });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Принятие заказа фрилансером по ID
exports.acceptOrder = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        project.freelancerId = req.body.freelancerId;
        await project.save();
        res.json({ message: 'Order accepted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
