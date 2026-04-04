<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coming Soon</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #000428, #004e92);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }

        .banner {
            padding: 50px;
            border-radius: 10px;
            box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        h1 {
            font-size: 3rem;
            letter-spacing: 3px;
            animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
            0% { text-shadow: 0px 0px 5px #fff; }
            100% { text-shadow: 0px 0px 20px #ff4081; }
        }

        .countdown {
            font-size: 2rem;
            margin: 20px 0;
        }

        .coming-soon {
            font-size: 1.2rem;
            margin-top: 10px;
        }

        /* Button Styling */
        .notify-btn {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1rem;
            border: none;
            color: white;
            background: #ff4081;
            cursor: pointer;
            transition: 0.3s;
            border-radius: 5px;
        }

        .notify-btn:hover {
            background: #ff1053;
        }
    </style>
</head>
<body>

    <div class="banner">
        <h1>COMING SOON</h1>
        <p class="coming-soon">We're launching something amazing!</p>
        <!--<div class="countdown" id="countdown">00d 00h 00m 00s</div>-->
        <!--<button class="notify-btn">Notify Me</button>-->
    </div>

    <script>
        // Countdown Timer
        function countdownTimer() {
            const launchDate = new Date("April 30, 2025 00:00:00").getTime();
            const timer = setInterval(function () {
                let now = new Date().getTime();
                let timeLeft = launchDate - now;

                if (timeLeft < 0) {
                    clearInterval(timer);
                    document.getElementById("countdown").innerHTML = "We are live!";
                    return;
                }

                let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }, 1000);
        }

        countdownTimer();
    </script>

</body>
</html>
