const Review = require('../models/Review');

// Создание нового отзыва
exports.createReview = async (req, res) => {
    const { reviewerId, revieweeId, rating, comment } = req.body;

    try {
        const review = new Review({
            reviewerId,
            revieweeId,
            rating,
            comment
        });

        await review.save();
        res.status(201).json({ message: 'Review created successfully', reviewId: review.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Получение всех отзывов для конкретного пользователя
exports.getReviewsByUser = async (req, res) => {
    try {
        const reviews = await Review.find({ revieweeId: req.params.userId });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
