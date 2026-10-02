console.log("Basketball Championship Game Loaded!");


// ======================================================
// BASIC HELPERS
// ======================================================

// ======================================================
// GLOBAL GAME SPEED
// ======================================================

// 1.00 = normal
// 1.25 = 25% faster
// 1.50 = 50% faster

const GAME_SPEED = 1.35;

const sleep = (ms) =>
  new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms / GAME_SPEED
      )
  );

// ======================================================
// STADIUM BACKGROUND AMBIENCE
// ======================================================

const stadiumSound =
  new Audio("./assets/sounds/stadium.mp3");

stadiumSound.loop = true;

// Background হওয়ায় volume কম রাখুন
stadiumSound.volume = 0.20;

let stadiumSoundStarted = false;


function startStadiumSound() {

  if (stadiumSoundStarted) return;

  stadiumSound.play()
    .then(() => {

      stadiumSoundStarted = true;

      console.log(
        "STADIUM SOUND PLAYING"
      );

    })
    .catch((error) => {

      console.error(
        "STADIUM SOUND ERROR:",
        error
      );

    });
}


// Browser audio unlock:
// screen-এ প্রথম real click/tap হলেই stadium ambience শুরু হবে

document.addEventListener(
  "pointerdown",
  startStadiumSound,
  { once: true }
);
// Auto-start stadium ambience for cloud/live mode
window.addEventListener("load", () => {
  setTimeout(() => {
    startStadiumSound();
  }, 2000);
});
// ======================================================
// GAME AUDIO UNLOCK SYSTEM
// ======================================================

let gameAudioUnlocked = false;

function unlockGameAudio() {

  if (gameAudioUnlocked) return;

  const unlockSound = new Audio(
    "./assets/sounds/throw.mp3"
  );

  unlockSound.volume = 0;

  unlockSound.play()
    .then(() => {

      unlockSound.pause();
      unlockSound.currentTime = 0;

      gameAudioUnlocked = true;

      console.log(
        "GAME AUDIO UNLOCKED"
      );

    })
    .catch(error => {

      console.log(
        "AUDIO UNLOCK FAILED:",
        error
      );

    });
}


// First real user interaction unlocks audio

document.addEventListener(
  "pointerdown",
  unlockGameAudio,
  { once: true }
);

document.addEventListener(
  "keydown",
  unlockGameAudio,
  { once: true }
);
// ======================================================
// ELEMENTS
// ======================================================

const leftCards =
  document.querySelectorAll("#left-teams .team-card");

const rightCards =
  document.querySelectorAll("#right-teams .team-card");


const teams = [

  {
    name: "USA",
    card: leftCards[0],
    flag: "assets/flags/us.png",
    shots: 0,
    score: 0,
    points: 0,
    forcedSuccess: null,
    totalWins: 0
  },

  {
    name: "INDIA",
    card: leftCards[1],
    flag: "assets/flags/in.png",
    shots: 0,
    score: 0,
    points: 0,
    forcedSuccess: null,
    totalWins: 0
  },

  {
    name: "GERMANY",
    card: leftCards[2],
    flag: "assets/flags/de.png",
    shots: 0,
    score: 0,
    points: 0,
    forcedSuccess: null,
    totalWins: 0
  },

  {
    name: "UK",
    card: rightCards[0],
    flag: "assets/flags/gb.png",
    shots: 0,
    score: 0,
    points: 0,
    forcedSuccess: null,
    totalWins: 0
  },

  {
    name: "BANGLADESH",
    card: rightCards[1],
    flag: "assets/flags/bd.png",
    shots: 0,
    score: 0,
    points: 0,
    forcedSuccess: null,
    totalWins: 0
  },

  {
    name: "AUSTRALIA",
    card: rightCards[2],
    flag: "assets/flags/au.png",
    shots: 0,
    score: 0,
    points: 0,
    forcedSuccess: null,
    totalWins: 0
  }

];


const finger =
  document.getElementById("finger");

const shootingBall =
  document.getElementById("shooting-ball");

const shootingBallImage =
  document.getElementById("shooting-ball-image");

const shotMessage =
  document.getElementById("shot-message");


// ======================================================
// SAFETY CHECK
// ======================================================

if (!finger) {
  console.error("Finger element not found.");
}

if (!shootingBall) {
  console.error("Shooting ball element not found.");
}

if (!shootingBallImage) {
  console.error("Shooting ball image not found.");
}

if (!shotMessage) {
  console.error("Shot message element not found.");
}


// ======================================================
// UPDATE TEAM SCOREBOARD
// ======================================================

function updateTeamScoreboard(team) {

  if (!team.card) return;

  const values =
    team.card.querySelectorAll(".stats strong");

  if (values.length < 3) return;

  values[0].textContent =
    `${team.shots}/6`;

  values[1].textContent =
    team.score;

  values[2].textContent =
    team.points;
}


// ======================================================
// GET CENTER
// ======================================================

function getCenter(element) {

  const rect =
    element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}


// ======================================================
// HOOP TARGET
// ======================================================

function getHoopTarget() {

  const target =
    document.getElementById("basket-target");

  if (!target) {

    console.error("basket-target not found");

    return {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.48
    };
  }

  return getCenter(target);
}


// ======================================================
// MESSAGE
// LARGE • BOLD • GOLDEN • DARK SHADOW • SMOOTH FADE
// ======================================================

async function showMessage(text) {

  if (!shotMessage) return;


  // ====================================================
  // MESSAGE CONTENT
  // ====================================================

  shotMessage.textContent = text;
const isBasket =
  text.trim().toUpperCase().includes("BASKET");
  // +10 BASKET! ONLY — MOVE DOWN
const messageY =
  isBasket ? "-30%" : "-50%";

// ====================================================
// BASKET MESSAGE POSITION
// +10 BASKET! = SLIGHTLY LOWER
// ====================================================


// ====================================================
// MESSAGE COLOR CONTROL
// MISS = RED
// EVERYTHING ELSE = GOLDEN
// ====================================================

if (text.trim().toUpperCase() === "MISS") {

  // MISS = BRIGHT RED
  shotMessage.style.setProperty(
    "color",
    "#ff1a1a",
    "important"
  );

  shotMessage.style.setProperty(
    "text-shadow",
    "0 4px 6px #000000, " +
    "0 0 10px #ff0000, " +
    "0 0 22px rgba(255,0,0,0.95), " +
    "0 0 38px rgba(255,0,0,0.65)",
    "important"
  );

} else {

  // ALL OTHER MESSAGES = GOLDEN
  shotMessage.style.setProperty(
    "color",
    "#FFD700",
    "important"
  );

  shotMessage.style.setProperty(
    "text-shadow",
    "0 4px 6px #000000, " +
    "0 0 12px rgba(255,215,0,0.95), " +
    "0 0 26px rgba(255,180,0,0.65)",
    "important"
  );
}


// ====================================================
// TEXT DESIGN
// ====================================================

shotMessage.style.fontWeight = "1000";

shotMessage.style.fontSize =
  "clamp(32px, 4.5vw, 72px)";

shotMessage.style.lineHeight = "1.05";

shotMessage.style.letterSpacing = "1.5px";

  shotMessage.style.fontSize =
    "clamp(32px, 4.5vw, 72px)";

  shotMessage.style.lineHeight = "1.05";

  shotMessage.style.letterSpacing = "1.5px";

  shotMessage.style.textAlign = "center";

  shotMessage.style.whiteSpace = "nowrap";


  // ====================================================
  // RICH GOLDEN TEXT
  // ====================================================


  // ====================================================
  // KEEP MESSAGE ABOVE GAME ELEMENTS
  // ====================================================

  shotMessage.style.zIndex = "999999";

  shotMessage.style.pointerEvents = "none";


  // ====================================================
  // START STATE
  // ====================================================

  shotMessage.style.transition = "none";

  shotMessage.style.opacity = "0";

  shotMessage.style.filter =
    "brightness(1.15)";

  shotMessage.style.transform =
  `translate(-50%, ${messageY}) scale(1)`;

  shotMessage.classList.add("show");


  // Allow browser to register starting state
  await sleep(40);


  // ====================================================
  // SMOOTH MAGICAL APPEAR
  // ====================================================

  shotMessage.style.transition =
    "opacity 0.50s ease-out, " +
    "transform 0.55s cubic-bezier(.16,1,.3,1), " +
    "filter 0.55s ease-out";


  shotMessage.style.opacity = "1";

  shotMessage.style.transform =
    "translate(-50%, -50%) scale(1)";

  shotMessage.style.filter =
    "brightness(1.05)";


  // Wait until appearance animation completes
  await sleep(550);


  // ====================================================
  // AUDIENCE READING TIME
  // FULLY VISIBLE FOR 1.5 SECONDS
  // ====================================================

  await sleep(1500);


  // ====================================================
  // VERY SOFT MAGICAL FADE OUT
  // ====================================================

  shotMessage.style.transition =
    "opacity 1.15s cubic-bezier(.4,0,.2,1), " +
    "transform 1.15s cubic-bezier(.4,0,.2,1), " +
    "filter 1.15s ease-in-out";


  shotMessage.style.opacity = "0";

  // Slight upward floating effect while disappearing
  shotMessage.style.transform =
  `translate(-50%, ${
    isBasket ? "-38%" : "-58%"
  }) scale(1.06)`;

  // Soft glow while disappearing
  shotMessage.style.filter =
    "brightness(1.30) blur(1.2px)";


  // Wait for fade animation to completely finish
  await sleep(1150);


  // ====================================================
  // CLEANUP
  // ====================================================

  shotMessage.classList.remove("show");

  shotMessage.style.transition = "";

  shotMessage.style.transform = "";

  shotMessage.style.opacity = "";

  shotMessage.style.filter = "";
}


// ======================================================
// FINGER PRESS
// ======================================================

async function fingerPress(ball) {

  const pos = getCenter(ball);

  // ======================================================
  // FORCE FINGER VISIBLE
  // ======================================================

  finger.textContent = "👆";

  finger.style.setProperty(
    "display",
    "flex",
    "important"
  );

  finger.style.setProperty(
    "visibility",
    "visible",
    "important"
  );

  finger.style.setProperty(
    "z-index",
    "999999",
    "important"
  );

  finger.style.setProperty(
    "position",
    "fixed",
    "important"
  );

  finger.style.pointerEvents = "none";

  finger.style.transition = "none";

  finger.style.opacity = "0";

  // Starting position
  finger.style.left =
    `${pos.x + 110}px`;

  finger.style.top =
    `${pos.y + 100}px`;

  finger.style.transform =
    "translate(-50%, -50%) scale(1)";

  await sleep(100);


  // ======================================================
  // SHOW FINGER
  // ======================================================

  finger.style.setProperty(
    "opacity",
    "1",
    "important"
  );

  await sleep(300);


  // ======================================================
  // MOVE FINGER TOWARD BALL
  // ======================================================

  finger.style.transition =
    "left 0.8s cubic-bezier(.2,.8,.2,1)," +
    "top 0.8s cubic-bezier(.2,.8,.2,1)," +
    "transform 0.18s ease," +
    "opacity 0.25s ease";

  finger.style.left =
    `${pos.x}px`;

  finger.style.top =
    `${pos.y + 12}px`;

  await sleep(850);


  /// ======================================================
// CLICK / PRESS + CLICK SOUND
// ======================================================

// Finger visually presses the ball
finger.style.transform =
  "translate(-50%, -50%) scale(.72)";


// CLICK SOUND
const clickSound =
  new Audio("./assets/sounds/click.mp3");

clickSound.volume = 0.90;
clickSound.currentTime = 0;

clickSound.play()
  .then(() => {
    console.log("CLICK SOUND PLAYING");
  })
  .catch((error) => {
    console.error(
      "CLICK SOUND ERROR:",
      error
    );
  });

  ball.style.transition =
    "transform .18s ease";

  ball.style.transform =
    "translateY(-50%) scale(1)";

  await sleep(350);


  // ======================================================
  // RELEASE
  // ======================================================

  finger.style.transform =
    "translate(-50%, -50%) scale(1)";

  ball.style.transform =
    "translateY(-50%) scale(1)";

  await sleep(250);


  // ======================================================
  // MOVE FINGER AWAY
  // ======================================================

  finger.style.left =
    `${pos.x + 80}px`;

  finger.style.top =
    `${pos.y + 100}px`;

  await sleep(500);


  // ======================================================
  // HIDE FINGER
  // ======================================================

  finger.style.setProperty(
    "opacity",
    "0",
    "important"
  );

  await sleep(250);
}


// ======================================================
// BALL FLIGHT
// MASTER BALL SIZE = 1.80
// ======================================================

function animateShot(start, target, success) {

  return new Promise(resolve => {

    const floorY =
      window.innerHeight * 0.88;
// BASKET / MISS SOUND LOCKS
let basketSoundPlayed = false;
let missSoundPlayed = false;

    const duration =
  (success ? 2300 : 2050) / GAME_SPEED;

    const startTime =
      performance.now();

    const missSide =
      Math.random() > 0.5 ? 1 : -1;

    const missX =
      target.x +
      missSide *
      (170 + Math.random() * 80);


    function lerp(a, b, t) {
      return a + (b - a) * t;
    }


    function frame(now) {

      const t =
        Math.min(
          (now - startTime) / duration,
          1
        );

      let x;
      let y;

      let scale = 1.80;
      let opacity = 1;


      // ==================================================
      // SUCCESS
      // ==================================================

      if (success) {


        // PHASE 1
        // LAUNCH → RIM

        if (t < 0.44) {

          const p =
            t / 0.44;

          x =
            lerp(
              start.x,
              target.x,
              p
            );

          const baseY =
            lerp(
              start.y,
              target.y - 42,
              p
            );

          const arc =
            -220 *
            4 *
            p *
            (1 - p);

          y =
            baseY + arc;

          scale = 1.80;

          document.body.classList.remove(
            "ball-inside-basket"
          );

          shootingBall.style.zIndex =
            "99998";
        }


        // PHASE 2
        // RIM → NET

        else if (t < 0.64) {

          const p =
            (t - 0.44) / 0.20;

          x =
            target.x;

          y =
            lerp(
              target.y - 42,
              target.y + 145,
              p
            );

          scale = 1.80;


          if (p < 0.16) {

  document.body.classList.remove(
    "ball-inside-basket"
  );

  shootingBall.style.zIndex =
    "99998";

} else {

  document.body.classList.add(
    "ball-inside-basket"
  );

  shootingBall.style.zIndex =
    "520";


  // ====================================================
  // SUCCESSFUL BASKET SOUND
  // ====================================================

  if (!basketSoundPlayed) {

    basketSoundPlayed = true;

    const basketSound =
      new Audio(
        "./assets/sounds/basket.mp3"
      );

    basketSound.volume = 1.0;
    basketSound.currentTime = 0;

    basketSound.play()
      .catch((error) => {

        console.error(
          "BASKET SOUND ERROR:",
          error
        );

      });
  }
}
        }


        // PHASE 3
        // NET → BOTTOM OPENING

        else if (t < 0.76) {

          const p =
            (t - 0.64) / 0.12;

          x =
            target.x;

          y =
            lerp(
              target.y + 145,
              target.y + 245,
              p
            );

          scale = 1.80;


          if (p < 0.82) {

            document.body.classList.add(
              "ball-inside-basket"
            );

            shootingBall.style.zIndex =
              "520";

          } else {

            document.body.classList.remove(
              "ball-inside-basket"
            );

            shootingBall.style.zIndex =
              "99998";
          }
        }


        // PHASE 4
        // NET → FLOOR

        else if (t < 0.84) {

          const p =
            (t - 0.76) / 0.08;

          document.body.classList.remove(
            "ball-inside-basket"
          );

          shootingBall.style.zIndex =
            "99998";

          x =
            lerp(
              target.x,
              target.x + 18,
              p
            );

          y =
            lerp(
              target.y + 245,
              floorY,
              p
            );

          scale = 1.80;
        }


        // PHASE 5
        // FIRST BOUNCE

        else if (t < 0.93) {

          const p =
            (t - 0.84) / 0.09;

          x =
            target.x +
            18 +
            p * 35;

          y =
            floorY -
            Math.sin(
              p * Math.PI
            ) * 65;

          scale = 1.80;
        }


        // PHASE 6
        // SECOND BOUNCE

        else {

          const p =
            (t - 0.93) / 0.07;

          x =
            target.x +
            53 +
            p * 30;

          y =
            floorY -
            Math.sin(
              p * Math.PI
            ) * 22;

          scale = 1.80;

          opacity =
            1 - p;
        }
      }


      // ==================================================
      // MISS
      // ==================================================

      else {

        document.body.classList.remove(
          "ball-inside-basket"
        );

        shootingBall.style.zIndex =
          "99998";


        // MISS PHASE 1

        if (t < 0.55) {

          const p =
            t / 0.55;

          x =
            lerp(
              start.x,
              missX,
              p
            );

          const missTargetY =
            target.y + 20;

          const baseY =
            lerp(
              start.y,
              missTargetY,
              p
            );

          const arc =
            -205 *
            4 *
            p *
            (1 - p);

          y =
            baseY + arc;

          scale = 1.80;
        }


        // MISS PHASE 2

        else if (t < 0.75) {

          const p =
            (t - 0.55) / 0.20;

          x =
            lerp(
              missX,
              missX + missSide * 60,
              p
            );

          y =
            lerp(
              target.y + 20,
              floorY,
              p
            );

          scale = 1.80;
        }


        // MISS PHASE 3

        else if (t < 0.89) {
// ======================================================
// MISS BALL FIRST GROUND TOUCH SOUND
// ======================================================

if (!missSoundPlayed) {

  missSoundPlayed = true;

  const missSound =
    new Audio(
      "./assets/sounds/miss.mp3"
    );

  missSound.volume = 1.0;
  missSound.currentTime = 0;

  missSound.play()
    .then(() => {
      console.log(
        "MISS GROUND SOUND PLAYING"
      );
    })
    .catch((error) => {
      console.error(
        "MISS SOUND ERROR:",
        error
      );
    });
}
          const p =
            (t - 0.75) / 0.14;

          x =
            missX +
            missSide *
            (60 + p * 60);

          y =
            floorY -
            Math.sin(
              p * Math.PI
            ) * 65;

          scale = 1.80;
        }


        // MISS PHASE 4

        else {

          const p =
            (t - 0.89) / 0.11;

          x =
            missX +
            missSide *
            (120 + p * 45);

          y =
            floorY -
            Math.sin(
              p * Math.PI
            ) * 22;

          scale = 1.80;

          opacity =
            1 - p;
        }
      }


      // DRAW BALL

      shootingBall.style.left =
        `${x}px`;

      shootingBall.style.top =
        `${y}px`;

      shootingBall.style.opacity =
        `${opacity}`;

      shootingBall.style.transform =
        `translate(-50%, -50%)
         rotate(${t * 900}deg)
         scale(${scale})`;


      if (t < 1) {

        requestAnimationFrame(frame);

      } else {

        shootingBall.style.opacity =
          "0";

        document.body.classList.remove(
          "ball-inside-basket"
        );

        shootingBall.style.zIndex =
          "99998";

        resolve();
      }
    }


    requestAnimationFrame(frame);
  });
}


// ======================================================
// TAKE ONE TEAM SHOT
// ======================================================

async function takeTeamShot(team) {

  if (!team || !team.card) {

    console.error("Invalid team.");

    return;
  }


  const flagBall =
    team.card.querySelector(
      ".flag-ball"
    );


  if (!flagBall) {

    console.error(
      `${team.name} flag ball not found.`
    );

    return;
  }


  const start =
    getCenter(flagBall);

  const target =
    getHoopTarget();


  const success =
    typeof team.forcedSuccess === "boolean"
      ? team.forcedSuccess
      : Math.random() < 0.62;


  team.card.classList.add(
    "active-team"
  );


  await fingerPress(
    flagBall
  );


  shootingBallImage.src =
    team.flag;


  shootingBall.style.display =
    "block";

  shootingBall.style.visibility =
    "visible";

  shootingBall.style.left =
    `${start.x}px`;

  shootingBall.style.top =
    `${start.y}px`;

  shootingBall.style.transform =
    "translate(-50%, -50%) scale(1.80)";

  shootingBall.style.opacity =
    "1";


  await sleep(120);


  flagBall.style.opacity =
    "0";


  await sleep(100);


  // ======================================================
// THROW SOUND
// ======================================================

const throwSound = new Audio("./assets/sounds/throw.mp3");

throwSound.volume = 1.0;

throwSound.currentTime = 0;

throwSound.play()
  .then(() => {
    console.log("THROW SOUND PLAYING");
  })
  .catch((error) => {
    console.error("THROW SOUND ERROR:", error);
  });


// ======================================================
// EXISTING SHOT ANIMATION
// ======================================================

await animateShot(
  start,
  target,
  success
);


  shootingBall.style.opacity =
    "0";

  flagBall.style.opacity =
    "1";


  team.shots++;


  if (success) {

    team.score++;

    team.points += 10;

    updateTeamScoreboard(team);

    await showMessage(
      "+10 BASKET!"
    );

  } else {

    updateTeamScoreboard(team);

    await showMessage(
      "MISS"
    );
  }


  team.card.classList.remove(
    "active-team"
  );


  await sleep(650);
}


// ======================================================
// CHAMPIONSHIP UI
// ======================================================

let championshipUI = null;

let roundHistory = [];


function createChampionshipUI() {

  if (
    document.getElementById(
      "championship-ui-style"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "championship-ui-style";


  style.textContent = `


    /* ==================================================
       ANIMATIONS
       ================================================== */


    @keyframes winnerNameBlink {

      0% {

        opacity: 1;

        transform:
          translateX(-50%)
          scale(1);

        text-shadow:
          0 0 10px #fff,
          0 0 20px gold,
          0 0 40px gold;
      }


      50% {

        opacity: .55;

        transform:
          translateX(-50%)
          scale(1.08);

        text-shadow:
          0 0 18px #fff,
          0 0 38px gold,
          0 0 70px #ffb300;
      }


      100% {

        opacity: 1;

        transform:
          translateX(-50%)
          scale(1);

        text-shadow:
          0 0 10px #fff,
          0 0 20px gold,
          0 0 40px gold;
      }
    }



    @keyframes crownFloat {

      0%, 100% {

        transform:
          translateX(-50%)
          translateY(0)
          rotate(-3deg)
          scale(1);
      }


      50% {

        transform:
          translateX(-50%)
          translateY(-10px)
          rotate(3deg)
          scale(1.08);
      }
    }



    @keyframes winnerCardPulse {

      0%, 100% {

        transform:
          translate(-50%, -50%)
          scale(1.55);
      }


      50% {

        transform:
          translate(-50%, -50%)
          scale(1.67);
      }
    }



    @keyframes confettiFall {

      0% {

        transform:
          translate3d(
            0,
            -12vh,
            0
          )
          rotate(0deg);

        opacity: 1;
      }


      100% {

        transform:
          translate3d(
            var(--drift),
            112vh,
            0
          )
          rotate(
            var(--rotation)
          );

        opacity: .9;
      }
    }



    @keyframes championGlow {

      0%, 100% {

        box-shadow:
          0 0 25px gold,
          0 0 55px
          rgba(255,215,0,.55);
      }


      50% {

        box-shadow:
          0 0 45px #fff4a3,
          0 0 90px gold;
      }
    }



    /* ==================================================
       ROUND PANEL
       50% LARGER
       ================================================== */


    #live-round-panel {

      position: fixed;

      top: 12px;

      left: 50%;

      transform:
        translateX(-50%);

      z-index: 700;


      display: flex;

      align-items: center;

      justify-content: center;


      gap: 18px;


      max-width: 96vw;


      padding:
        18px 33px;


      border-radius:
        30px;


      background:
        rgba(3, 9, 22, .92);


      border:
        3px solid
        rgba(255, 215, 0, .52);


      box-shadow:
        0 10px 35px
        rgba(0,0,0,.50),

        0 0 28px
        rgba(255,215,0,.20);


      overflow: hidden;


      pointer-events: none;
    }



    .live-round-title {

      color:
        #ffd54a;


      font-weight:
        900;


      font-size:
        30px;


      white-space:
        nowrap;


      margin-right:
        12px;


      letter-spacing:
        1.8px;
    }



    .round-pill {

      min-width:
        72px;


      height:
        65px;


      padding:
        0 20px;


      display:
        flex;


      justify-content:
        center;


      align-items:
        center;


      border-radius:
        36px;


      font-size:
        30px;


      font-weight:
        900;


      color:
        rgba(
          255,
          255,
          255,
          .80
        );


      background:
        rgba(
          255,
          255,
          255,
          .09
        );


      border:
        3px solid
        rgba(
          255,
          255,
          255,
          .20
        );


      white-space:
        nowrap;
    }



    .round-pill.active {

      color:
        #101010;


      background:
        linear-gradient(
          180deg,
          #fff4a3,
          #ffc400
        );


      border-color:
        #fff3a0;


      transform:
        scale(1.15);


      box-shadow:
        0 0 32px
        rgba(
          255,
          215,
          0,
          .98
        );
    }



    /* ==================================================
       ALL-TIME WINS SCOREBOARD
       40% LARGER
       ================================================== */


    #all-time-wins-board {

      position:
        fixed;


      left:
        50%;


      bottom:
        10px;


      transform:
        translateX(-50%);


      z-index:
        750;


      width:
        min(
          99vw,
          1930px
        );


      box-sizing:
        border-box;


      display:
        flex;


      align-items:
        center;


      justify-content:
        center;


      gap:
        14px;


      padding:
        14px 21px;


      border-radius:
        25px;


      background:
        rgba(
          2,
          7,
          18,
          .95
        );


      border:
        3px solid
        rgba(
          255,
          215,
          0,
          .52
        );


      box-shadow:
        0 -7px 34px
        rgba(
          0,
          0,
          0,
          .48
        ),

        0 0 24px
        rgba(
          255,
          215,
          0,
          .16
        );


      pointer-events:
        none;
    }



    .wins-title {

      color:
        #ffd84a;


      font-weight:
        900;


      font-size:
        22px;


      margin-right:
        14px;


      white-space:
        nowrap;


      letter-spacing:
        .7px;
    }



    .wins-team {

      display:
        flex;


      align-items:
        center;


      justify-content:
        center;


      gap:
        10px;


      padding:
        10px 17px;


      border-radius:
        15px;


      background:
        rgba(
          255,
          255,
          255,
          .08
        );


      border:
        1px solid
        rgba(
          255,
          255,
          255,
          .12
        );


      color:
        white;


      font-size:
        20px;


      font-weight:
        800;


      white-space:
        nowrap;
    }



    .wins-team img {

      width:
        38px;


      height:
        38px;


      border-radius:
        50%;


      object-fit:
        cover;
    }



    .wins-team strong {

      color:
        #ffd84a;


      font-size:
        27px;


      font-weight:
        900;


      min-width:
        25px;


      text-align:
        center;
    }



    /* ==================================================
       WINNER CELEBRATION
       ================================================== */


    #winner-celebration-layer {

      position:
        fixed;

      inset:
        0;

      z-index:
        999980;

      overflow:
        hidden;

      pointer-events:
        none;
    }



    #winner-dark-layer {

      position:
        absolute;

      inset:
        0;

      background:
        radial-gradient(
          circle at center,
          rgba(24,34,50,.18) 0%,
          rgba(0,0,0,.72) 58%,
          rgba(0,0,0,.90) 100%
        );
    }



    #winner-spotlight {

      position:
        absolute;

      left:
        50%;

      top:
        52%;

      width:
        520px;

      height:
        520px;

      transform:
        translate(
          -50%,
          -50%
        );

      border-radius:
        50%;

      background:
        radial-gradient(
          circle,
          rgba(255,225,100,.27),
          rgba(255,215,0,.08) 42%,
          transparent 70%
        );

      filter:
        none;
    }



    #winner-big-name {

      position:
        fixed;

      left:
        50%;

      top:
        10%;

      transform:
        translateX(-50%);

      z-index:
        1000004;

      color:
        #fff;

      font-size:
        clamp(
          32px,
          5vw,
          64px
        );

      line-height:
        1;

      font-weight:
        1000;

      letter-spacing:
        2px;

      white-space:
        nowrap;

      text-align:
        center;

      animation:
        winnerNameBlink
        .72s
        ease-in-out
        infinite;
    }



    #winner-round-text {

      position:
        fixed;

      left:
        50%;

      top:
        20%;

      transform:
        translateX(-50%);

      z-index:
        1000004;

      color:
        #ffd84a;

      font-size:
        clamp(
          15px,
          2vw,
          23px
        );

      font-weight:
        900;

      letter-spacing:
        4px;

      white-space:
        nowrap;

      text-shadow:
        0 3px 8px
        #000;
    }



    #winner-crown {

      position:
        fixed;

      left:
        50%;

      top:
        calc(
          50% - 190px
        );

      transform:
        translateX(-50%);

      z-index:
        1000006;

      font-size:
        clamp(
          72px,
          8vw,
          115px
        );

      line-height:
        1;

      filter:
        drop-shadow(
          0 8px 6px
          rgba(0,0,0,.6)
        )
        drop-shadow(
          0 0 18px
          gold
        );

      animation:
        crownFloat
        1.1s
        ease-in-out
        infinite;
    }



    .celebration-confetti {

      position:
        absolute;

      top:
        -10vh;

      border-radius:
        2px;

      opacity:
        1;

      animation-name:
        confettiFall;

      animation-timing-function:
        linear;

      animation-iteration-count:
        1;

      will-change:
        transform;
    }



    .winner-card-sharp {

      position:
        fixed !important;

      left:
        50% !important;

      top:
        55% !important;

      margin:
        0 !important;

      z-index:
        1000005 !important;

      opacity:
        1 !important;

      visibility:
        visible !important;


      filter:
        brightness(1.20)
        contrast(1.12)
        saturate(1.16)
        drop-shadow(
          0 0 20px
          rgba(255,215,0,1)
        )
        drop-shadow(
          0 0 45px
          rgba(255,190,0,.70)
        ) !important;


      transform:
        translate(
          -50%,
          -50%
        )
        scale(1.55)
        !important;


      animation:
        winnerCardPulse
        .85s
        ease-in-out
        infinite,

        championGlow
        1.1s
        ease-in-out
        infinite
        !important;


      image-rendering:
        auto;


      backface-visibility:
        hidden;


      -webkit-font-smoothing:
        antialiased;
    }
     /* ======================================================
   PREMIUM GLOBAL LIGHTING SYSTEM
   DESIGN / SIZE / POSITION UNCHANGED
   ====================================================== */


/* ======================================================
   1. BORDER LIGHT TRAVEL
   Light appears to travel around the box
   ====================================================== */

@keyframes borderLightTravel {

  0% {
    box-shadow:
      0 -2px 9px rgba(80,190,255,.80),
      5px 0 13px rgba(80,190,255,.12),
      0 5px 13px rgba(80,190,255,.08),
      -5px 0 13px rgba(80,190,255,.12),
      inset 0 0 10px rgba(90,180,255,.08);
  }

  25% {
    box-shadow:
      0 -2px 10px rgba(80,190,255,.12),
      5px 0 16px rgba(80,210,255,.90),
      0 5px 13px rgba(80,190,255,.10),
      -5px 0 10px rgba(80,190,255,.08),
      inset 0 0 13px rgba(90,190,255,.12);
  }

  50% {
    box-shadow:
      0 -2px 10px rgba(80,190,255,.08),
      5px 0 12px rgba(80,190,255,.12),
      0 5px 18px rgba(80,210,255,.95),
      -5px 0 12px rgba(80,190,255,.10),
      inset 0 0 15px rgba(90,190,255,.14);
  }

  75% {
    box-shadow:
      0 -2px 10px rgba(80,190,255,.10),
      5px 0 10px rgba(80,190,255,.08),
      0 5px 12px rgba(80,190,255,.12),
      -5px 0 17px rgba(80,210,255,.92),
      inset 0 0 13px rgba(90,190,255,.12);
  }

  100% {
    box-shadow:
      0 -2px 9px rgba(80,190,255,.80),
      5px 0 13px rgba(80,190,255,.12),
      0 5px 13px rgba(80,190,255,.08),
      -5px 0 13px rgba(80,190,255,.12),
      inset 0 0 10px rgba(90,180,255,.08);
  }
}


/* ======================================================
   2. GOLD BORDER LIGHT
   For main championship panels
   ====================================================== */

@keyframes goldBorderTravel {

  0% {
    box-shadow:
      0 -2px 12px rgba(255,215,0,.90),
      5px 0 14px rgba(255,190,0,.15),
      0 5px 14px rgba(255,190,0,.08),
      -5px 0 14px rgba(255,190,0,.15),
      inset 0 0 14px rgba(255,215,0,.08);
  }

  25% {
    box-shadow:
      0 -2px 12px rgba(255,190,0,.12),
      5px 0 20px rgba(255,215,0,.95),
      0 5px 14px rgba(255,190,0,.10),
      -5px 0 12px rgba(255,190,0,.08),
      inset 0 0 17px rgba(255,215,0,.12);
  }

  50% {
    box-shadow:
      0 -2px 12px rgba(255,190,0,.08),
      5px 0 14px rgba(255,190,0,.12),
      0 5px 21px rgba(255,215,0,.98),
      -5px 0 14px rgba(255,190,0,.10),
      inset 0 0 18px rgba(255,215,0,.14);
  }

  75% {
    box-shadow:
      0 -2px 12px rgba(255,190,0,.10),
      5px 0 12px rgba(255,190,0,.08),
      0 5px 14px rgba(255,190,0,.12),
      -5px 0 20px rgba(255,215,0,.95),
      inset 0 0 17px rgba(255,215,0,.12);
  }

  100% {
    box-shadow:
      0 -2px 12px rgba(255,215,0,.90),
      5px 0 14px rgba(255,190,0,.15),
      0 5px 14px rgba(255,190,0,.08),
      -5px 0 14px rgba(255,190,0,.15),
      inset 0 0 14px rgba(255,215,0,.08);
  }
}


/* ======================================================
   3. INNER LIGHT BREATHING
   ====================================================== */

@keyframes innerGlowBreath {

  0%,
  100% {
    filter:
      brightness(1)
      saturate(1);
  }

  50% {
    filter:
      brightness(1.07)
      saturate(1.08);
  }
}


/* ======================================================
   COUNTRY CARDS
   Existing shape/design remains unchanged
   ====================================================== */

.team-card {

  animation:
    borderLightTravel 3.2s linear infinite,
    innerGlowBreath 2.8s ease-in-out infinite;

  transition:
    box-shadow .35s ease,
    filter .35s ease;
}


/* Different timing makes the six boxes feel alive */

#left-teams .team-card:nth-child(1) {
  animation-delay: 0s, 0s;
}

#left-teams .team-card:nth-child(2) {
  animation-delay: -.55s, -.35s;
}

#left-teams .team-card:nth-child(3) {
  animation-delay: -1.10s, -.70s;
}

#right-teams .team-card:nth-child(1) {
  animation-delay: -1.65s, -1.05s;
}

#right-teams .team-card:nth-child(2) {
  animation-delay: -2.20s, -1.40s;
}

#right-teams .team-card:nth-child(3) {
  animation-delay: -2.75s, -1.75s;
}


/* ======================================================
   SHOTS / SCORE / POINTS PANEL
   ====================================================== */

.team-card .stats {

  animation:
    borderLightTravel 4.4s linear infinite;

  box-shadow:
    inset 0 0 12px rgba(80,180,255,.10);
}


/* ======================================================
   ACTIVE COUNTRY
   Stronger but same design
   ====================================================== */

.team-card.active-team {

  animation:
    borderLightTravel 1.35s linear infinite,
    innerGlowBreath 1s ease-in-out infinite;

  filter:
    brightness(1.10)
    saturate(1.10);
}


/* ======================================================
   ROUND MAIN PANEL
   Keep current gold design
   ====================================================== */

#live-round-panel {

  animation:
    goldBorderTravel 3.8s linear infinite;
}


/* ======================================================
   ROUND NUMBER PILLS
   ====================================================== */

.round-pill {

  animation:
    borderLightTravel 4.5s linear infinite;
}


/* Current round gets stronger golden light */

.round-pill.active {

  animation:
    goldBorderTravel 1.8s linear infinite;
}


/* ======================================================
   ALL-TIME WINS MAIN PANEL
   ====================================================== */

#all-time-wins-board {

  animation:
    goldBorderTravel 4.2s linear infinite;
}


/* ======================================================
   INDIVIDUAL ALL-TIME COUNTRY BOXES
   ====================================================== */

.wins-team {

  animation:
    borderLightTravel 4.8s linear infinite;
}


/* Stagger individual scoreboard boxes */

.wins-team:nth-child(2) {
  animation-delay: 0s;
}

.wins-team:nth-child(3) {
  animation-delay: -.55s;
}

.wins-team:nth-child(4) {
  animation-delay: -1.10s;
}

.wins-team:nth-child(5) {
  animation-delay: -1.65s;
}

.wins-team:nth-child(6) {
  animation-delay: -2.20s;
}

.wins-team:nth-child(7) {
  animation-delay: -2.75s;
}   

  `;


  document.head.appendChild(
    style
  );


  // ROUND PANEL

  const roundPanel =
    document.createElement(
      "div"
    );


  roundPanel.id =
    "live-round-panel";


  roundPanel.innerHTML =
    `<span class="live-round-title">🏀 ROUND</span>`;


  document.body.appendChild(
    roundPanel
  );


  // ALL-TIME WINS BOARD

  const winsBoard =
    document.createElement(
      "div"
    );


  winsBoard.id =
    "all-time-wins-board";


  document.body.appendChild(
    winsBoard
  );


  championshipUI = {

    roundPanel,

    winsBoard

  };


  updateAllTimeWinsBoard();
}


// ======================================================
// ROUND DISPLAY
// ======================================================

function updateRoundDisplay(
  roundNumber
) {

  if (!championshipUI) {

    createChampionshipUI();
  }


  roundHistory.push(
    roundNumber
  );


  // Latest 7 rounds visible

  if (
    roundHistory.length > 7
  ) {

    roundHistory =
      roundHistory.slice(-7);
  }


  championshipUI
    .roundPanel
    .innerHTML =

    `<span class="live-round-title">🏀 ROUND</span>`;


  for (
    const number of roundHistory
  ) {

    const pill =
      document.createElement(
        "div"
      );


    pill.className =
      "round-pill" +
      (
        number === roundNumber
          ? " active"
          : ""
      );


    pill.textContent =
      number;


    championshipUI
      .roundPanel
      .appendChild(
        pill
      );
  }
}


// ======================================================
// ALL-TIME WINS BOARD
// ======================================================

function updateAllTimeWinsBoard() {

  if (!championshipUI) {

    return;
  }


  championshipUI
    .winsBoard
    .innerHTML =

    `<div class="wins-title">🏆 ALL-TIME WINS</div>`;


  for (
    const team of teams
  ) {

    const item =
      document.createElement(
        "div"
      );


    item.className =
      "wins-team";


    item.innerHTML = `

      <img
        src="${team.flag}"
        alt="${team.name}"
      >

      <span>
        ${team.name}
      </span>

      <strong>
        ${team.totalWins}
      </strong>

    `;


    championshipUI
      .winsBoard
      .appendChild(
        item
      );
  }
}


// ======================================================
// CONFETTI
// ======================================================

function createConfetti(
  layer
) {

  const colors = [

    "#FFD700",

    "#FFFFFF",

    "#FF3B30",

    "#34C759",

    "#0A84FF",

    "#AF52DE",

    "#FF9F0A"

  ];


  const fragment =
    document.createDocumentFragment();


  for (
    let i = 0;
    i < 95;
    i++
  ) {

    const piece =
      document.createElement(
        "div"
      );


    piece.className =
      "celebration-confetti";


    const width =
      5 +
      Math.random() * 7;


    const height =
      8 +
      Math.random() * 11;


    piece.style.left =
      `${Math.random() * 100}%`;


    piece.style.width =
      `${width}px`;


    piece.style.height =
      `${height}px`;


    piece.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    piece.style.animationDuration =
      `${
        2.4 +
        Math.random() *
        2.3
      }s`;


    piece.style.animationDelay =
      `${
        Math.random() *
        1.0
      }s`;


    piece.style.setProperty(
      "--drift",
      `${
        -100 +
        Math.random() *
        200
      }px`
    );


    piece.style.setProperty(
      "--rotation",
      `${
        360 +
        Math.random() *
        900
      }deg`
    );


    fragment.appendChild(
      piece
    );
  }


  layer.appendChild(
    fragment
  );
}


// ======================================================
// WINNER CELEBRATION
// ======================================================

async function celebrateWinner(
  winner,
  roundNumber
) {

  if (
    !winner ||
    !winner.card
  ) {

    return;
  }

// ======================================================
  // WINNER CELEBRATION SOUND
  // ======================================================

  const winnerSound =
    new Audio("./assets/sounds/winner.mp3");

  winnerSound.volume = 1.0;
  winnerSound.currentTime = 0;

  winnerSound.play()
    .then(() => {

      console.log(
        "WINNER SOUND PLAYING"
      );

    })
    .catch((error) => {

      console.error(
        "WINNER SOUND ERROR:",
        error
      );

    });


  // ======================================================
  // EXISTING WINNER CODE
  // ======================================================

  const card =
    winner.card;


  const originalStyle =
    card.getAttribute(
      "style"
    );


  // MASTER CELEBRATION LAYER

  const layer =
    document.createElement(
      "div"
    );


  layer.id =
    "winner-celebration-layer";


  const darkLayer =
    document.createElement(
      "div"
    );


  darkLayer.id =
    "winner-dark-layer";


  const spotlight =
    document.createElement(
      "div"
    );


  spotlight.id =
    "winner-spotlight";


  layer.appendChild(
    darkLayer
  );


  layer.appendChild(
    spotlight
  );


  document.body.appendChild(
    layer
  );


  // CONFETTI

  createConfetti(
    layer
  );


  // WINNER NAME

  const winnerName =
    document.createElement(
      "div"
    );


  winnerName.id =
    "winner-big-name";


  winnerName.textContent =
    `${winner.name} WINNER!`;


  document.body.appendChild(
    winnerName
  );


  // ROUND CHAMPION

  const roundText =
    document.createElement(
      "div"
    );


  roundText.id =
    "winner-round-text";


  roundText.textContent =
    `ROUND ${roundNumber} CHAMPION`;


  document.body.appendChild(
    roundText
  );


  // CROWN

  const crown =
    document.createElement(
      "div"
    );


  crown.id =
    "winner-crown";


  crown.textContent =
    "👑";


  document.body.appendChild(
    crown
  );


  // WINNER CARD TO CENTER

  card.classList.add(
    "winner-card-sharp"
  );


  card.style.opacity =
    "1";


  card.style.visibility =
    "visible";


  const images =
    card.querySelectorAll(
      "img"
    );


  images.forEach(
    img => {

      img.style.filter =
        "none";

      img.style.opacity =
        "1";

      img.style.visibility =
        "visible";

    }
  );


  // CELEBRATION HOLD

  await sleep(
    5200
  );


  // RESTORE CARD

  card.classList.remove(
    "winner-card-sharp"
  );


  if (
    originalStyle !== null
  ) {

    card.setAttribute(
      "style",
      originalStyle
    );

  } else {

    card.removeAttribute(
      "style"
    );
  }


  winnerName.remove();

  roundText.remove();

  crown.remove();

  layer.remove();


  await sleep(
    700
  );
}


// ======================================================
// CREATE EXACT SHOT RESULTS
// ======================================================

function createShotResults(
  successfulBaskets
) {

  const results = [];


  for (
    let i = 0;
    i < successfulBaskets;
    i++
  ) {

    results.push(
      true
    );
  }


  while (
    results.length < 6
  ) {

    results.push(
      false
    );
  }


  // SHUFFLE

  for (
    let i =
      results.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      results[i],
      results[j]
    ] = [

      results[j],
      results[i]

    ];
  }


  return results;
}


// ======================================================
// RESET ROUND
//
// totalWins NEVER RESETS
// ======================================================

function resetRound() {

  for (
    const team of teams
  ) {

    team.shots =
      0;


    team.score =
      0;


    team.points =
      0;


    team.forcedSuccess =
      null;


    updateTeamScoreboard(
      team
    );


    if (team.card) {

      team.card.classList.remove(
        "active-team"
      );


      team.card.classList.remove(
        "winner-card-sharp"
      );
    }
  }


  shootingBall.style.opacity =
    "0";


  finger.style.opacity =
    "0";


  document.body.classList.remove(
    "ball-inside-basket"
  );
}


// ======================================================
// FULL INFINITE CHAMPIONSHIP
// ======================================================

async function runFullGame() {

  let roundNumber =
    1;


  createChampionshipUI();


  while (true) {


    console.log(
      `ROUND ${roundNumber} STARTING`
    );


    // RESET ROUND

    resetRound();


    // UPDATE ROUND DISPLAY

    updateRoundDisplay(
      roundNumber
    );


    await showMessage(
      `ROUND ${roundNumber}`
    );


    await sleep(
      1000
    );


    // ==================================================
    // RANDOM WINNER
    // ==================================================

    const winnerIndex =
      Math.floor(
        Math.random() *
        teams.length
      );


    const winner =
      teams[
        winnerIndex
      ];


    console.log(
      `DESIGNATED WINNER: ${winner.name}`
    );


    // ==================================================
    // GUARANTEED HIGHEST SCORE
    //
    // WINNER = 4, 5 OR 6 BASKETS
    // ==================================================

    const winnerBaskets =
      4 +
      Math.floor(
        Math.random() *
        3
      );


    const basketTargets =
      new Map();


    basketTargets.set(
      winner,
      winnerBaskets
    );


    for (
      const team of teams
    ) {

      if (
        team === winner
      ) {

        continue;
      }


      const maxOtherBaskets =
        winnerBaskets - 1;


      const otherBaskets =
        Math.floor(
          Math.random() *
          (
            maxOtherBaskets +
            1
          )
        );


      basketTargets.set(
        team,
        otherBaskets
      );
    }


    // ==================================================
    // PLAY ALL TEAMS
    // ==================================================

    for (
      const team of teams
    ) {


      await showMessage(
        `${team.name} — YOUR TURN`
      );


      const targetBaskets =
        basketTargets.get(
          team
        );


      const results =
        createShotResults(
          targetBaskets
        );


      // SIX SHOTS

      for (
        let shot = 0;
        shot < 6;
        shot++
      ) {

        team.forcedSuccess =
          results[
            shot
          ];


        console.log(
          `${team.name} SHOT ${shot + 1}/6`
        );


        await takeTeamShot(
          team
        );
      }


      team.forcedSuccess =
        null;


      await showMessage(
        `${team.name} FINISHED — ${team.points} POINTS`
      );


      await sleep(
        700
      );
    }


    // ==================================================
    // VERIFY WINNER
    // ==================================================

    const otherTeams =
      teams.filter(
        team =>
          team !== winner
      );


    const highestOtherPoints =
      Math.max(
        ...otherTeams.map(
          team =>
            team.points
        )
      );


    console.log(
      `ROUND ${roundNumber} COMPLETE`
    );


    console.log(
      `WINNER: ${winner.name}`
    );


    console.log(
      `WINNER POINTS: ${winner.points}`
    );


    console.log(
      `HIGHEST OTHER POINTS: ${highestOtherPoints}`
    );


    if (
      winner.points <=
      highestOtherPoints
    ) {

      console.error(
        "Winner score safety check failed."
      );

    } else {

      console.log(
        "Winner score confirmed."
      );
    }


    // ==================================================
    // REGISTER ALL-TIME WIN
    // ==================================================

    winner.totalWins++;


    updateAllTimeWinsBoard();


    // ==================================================
    // WINNER MESSAGE
    // ==================================================

    await showMessage(
      `${winner.name} WINS ROUND ${roundNumber}!`
    );


    // ==================================================
    // WINNER CELEBRATION
    // ==================================================

    await celebrateWinner(
      winner,
      roundNumber
    );


    // ==================================================
    // WAIT BEFORE NEXT ROUND
    // ==================================================

    await sleep(
      1600
    );


    // NEXT ROUND

    roundNumber++;
  }
}


// ======================================================
// START GAME
// ======================================================

window.addEventListener(
  "load",
  () => {


    const allTeamCardsReady =
      teams.every(
        team =>
          Boolean(
            team.card
          )
      );


    if (
      allTeamCardsReady &&
      finger &&
      shootingBall &&
      shootingBallImage &&
      shotMessage
    ) {


      console.log(
        "Starting Infinite Basketball Championship..."
      );


      runFullGame()
        .catch(
          error => {

            console.error(
              "GAME ERROR:",
              error
            );

          }
        );


    } else {


      console.error(
        "Game cannot start because required HTML elements are missing."
      );

    }
  }
);
