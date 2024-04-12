document.addEventListener('DOMContentLoaded', function() {
    const ratingStars = document.querySelectorAll('.rating span');
    const feedbackInput = document.getElementById('feedback-input');
    const submitButton = document.getElementById('submit-feedback');

    let selectedRating = 0;

    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            highlightStars();
        });
    });

    function highlightStars() {
        ratingStars.forEach((star, index) => {
            if (index < selectedRating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    submitButton.addEventListener('click', function() {
        const feedbackText = feedbackInput.value.trim();

        if (selectedRating === 0 || feedbackText.length === 0) {
            alert('Please provide both a rating and feedback text.');
            return;
        }

        const feedback = {
            rating: selectedRating,
            text: feedbackText,
        };

        // Your code to submit the feedback, e.g., send it to the server
        // You can replace the alert below with your desired feedback submission logic
        alert('Feedback submitted successfully!');
        
        // Clear input fields and reset selected rating
        feedbackInput.value = '';
        selectedRating = 0;
        highlightStars();
    });
});
