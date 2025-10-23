#!/bin/bash

echo "Testing Hero Carousel Image URLs..."
echo ""

echo "Slide 1:"
curl -sI "https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_1920/819b0e94-96d7-4b7a-98d5-4843d5b0a122_rbk4en" | grep -E "HTTP|x-cld-error"

echo "Slide 2 (FIXED):"
curl -sI "https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_1920/tommy-coconut/villas/dushi-hideaway" | grep -E "HTTP|x-cld-error"

echo "Slide 3:"
curl -sI "https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_1920/ace13210-506b-4143-915f-001bf71166c3_jhryvm" | grep -E "HTTP|x-cld-error"

echo "Slide 4:"
curl -sI "https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_1920/9f97bb52-0859-4d47-85cb-866836c8e0ff_mc4hrr" | grep -E "HTTP|x-cld-error"

echo "Slide 5:"
curl -sI "https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_1920/happy-hideaway-38_jtogtx" | grep -E "HTTP|x-cld-error"

echo "Slide 6:"
curl -sI "https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_1920/0d19be00-f37f-4b0b-b48a-50e5b58ed35b_jujf2g" | grep -E "HTTP|x-cld-error"

echo ""
echo "All tests complete!"
