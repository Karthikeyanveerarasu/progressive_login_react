import React, { useEffect, useRef } from "react";
import "./styles.css"; // Import the CSS styles

export default function SignUpForm() {
  const appCoverRef = useRef(null);
  const emailInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const app_cover = appCoverRef.current;
    const inp = document.querySelectorAll(".inp");
    const prevAction = document.getElementById("prev-action-btn");
    const nextAction = document.getElementById("next-action-btn");
    let stepComplete = false;
    const progress = document.getElementById("progress");
    let timeOut = null;
    const stepsArr = ["email", "username", "password"];
    let stepNumber = 1;
    let lastCompletedStep = 0;
    const totalSteps = stepsArr.length;

    function checkApp() {
      if (stepNumber > 1) return;

      let active = false;
      inp.forEach((input) => {
        if (input.value.trim().length > 0) active = true;
      });

      if (active) app_cover.classList.add("active");
      else {
        app_cover.classList.remove("active");
        inp.forEach((input) => {
          input.parentElement.classList.remove("active");
        });
      }
    }

    function _a() {
      nextAction.classList.add("active");
      stepComplete = true;
      if (lastCompletedStep < stepNumber) lastCompletedStep = stepNumber;
    }

    function _b() {
      nextAction.classList.remove("active");
      stepComplete = false;
    }

    function checkInput() {
      const _this = event.target;
      let regex;
      const index = stepNumber - 1;
      const _val = _this.value.trim();
      if (stepsArr[index] === "email") {
        regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (regex.test(_val)) _a();
        else _b();
      } else if (stepsArr[index] === "username") {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
          if (_val.length > 0) _a();
          else _b();
        }, 500);
      } else if (stepsArr[index] === "password") {
        if (_val.length >= 5) _a();
        else _b();
      }
    }

    function clearForm() {
      inp.forEach((input) => {
        input.value = "";
        input.parentElement.classList.remove("active", "inactive");
      });
      nextAction.classList.remove("active");
      prevAction.removeAttribute("class");
      nextAction.removeAttribute("class");
    }

    function moveToPreviousStep() {
      --stepNumber;

      if (stepNumber < 1) {
        stepNumber = 1;
        prevAction.classList.remove("active");
        return;
      } else {
        if (stepNumber === 1) prevAction.classList.remove("active");

        if (stepNumber <= lastCompletedStep) stepComplete = true;

        nextAction.classList.add("active");

        progress.style.width = ((stepNumber - 1) / totalSteps) * 100 + "%";
        document
          .getElementById(stepsArr[stepNumber])
          .classList.remove("active");
        document
          .getElementById(stepsArr[stepNumber - 1])
          .classList.remove("inactive");
      }
    }

    function moveToNextStep() {
      if (
        stepComplete &&
        document
          .getElementById(stepsArr[stepNumber - 1])
          .querySelector(".inp")
          .value.trim().length > 0
      ) {
        progress.style.width = (stepNumber / totalSteps) * 100 + "%";

        prevAction.classList.add("active");

        if (stepNumber === totalSteps) {
          setTimeout(() => {
            document
              .getElementById("progress-bar-cover")
              .classList.add("hide-form");
            document.getElementById("working").style.display = "block";

            setTimeout(() => {
              document.getElementById("working").classList.add("inactive");
              clearForm();
            }, 2300);

            setTimeout(() => {
              document.getElementById("acc-success").classList.add("active");
            }, 3300);
          }, 500);

          return;
        }

        document
          .getElementById(stepsArr[stepNumber - 1])
          .classList.add("inactive");
        document.getElementById(stepsArr[stepNumber]).classList.add("active");

        if (stepNumber > lastCompletedStep) {
          lastCompletedStep = stepNumber;
          stepComplete = false;
        }

        ++stepNumber; // Now on next step

        if (
          stepNumber <= lastCompletedStep &&
          document
            .getElementById(stepsArr[stepNumber - 1])
            .querySelector(".inp")
            .value.trim().length > 0
        )
          nextAction.classList.add("active");
        else nextAction.classList.remove("active");
      }
    }

    app_cover.addEventListener("mouseenter", () => {
      const f_elm = document.getElementById(stepsArr[0]);
      if (!app_cover.classList.contains("active")) {
        app_cover.classList.add("active");
        f_elm.classList.add("active");
        setTimeout(() => {
          f_elm.querySelector("input").focus();
        }, 1205);
        stepNumber = 1;
        lastCompletedStep = 0;
        stepComplete = false;
      }
    });

    inp.forEach((input) => {
      input.addEventListener("keyup", checkInput);
    });

    prevAction.addEventListener("click", moveToPreviousStep);
    nextAction.addEventListener("click", moveToNextStep);

    // Cleanup event listeners on component unmount
    return () => {
      app_cover.removeEventListener("mouseenter", () => {});
      inp.forEach((input) => {
        input.removeEventListener("keyup", checkInput);
      });
      prevAction.removeEventListener("click", moveToPreviousStep);
      nextAction.removeEventListener("click", moveToNextStep);
    };
  }, []);

  return (
    <div className="App">
      <div id="app-cover" ref={appCoverRef}>
        <h1 id="heading">Sign Up</h1>
        <form method="post" action="" autoComplete="off">
          <div id="inp-box-cover">
            <div id="inp-padd">
              <div className="inp-box" id="email">
                <input
                  type="email"
                  className="inp"
                  placeholder="Your email address"
                  spellCheck="false"
                  autoComplete="off"
                  ref={emailInputRef}
                />
              </div>
              <div className="inp-box" id="username">
                <input
                  type="text"
                  className="inp"
                  placeholder="Your username"
                  spellCheck="false"
                  ref={usernameInputRef}
                />
              </div>
              <div className="inp-box" id="password">
                <input
                  type="password"
                  className="inp"
                  placeholder="Password (More than 5 characters)"
                  ref={passwordInputRef}
                />
              </div>
              <div id="prev-action-btn">
                <i className="fas fa-chevron-circle-left"></i>
              </div>
              <div id="next-action-btn">
                <i className="fas fa-chevron-circle-right"></i>
              </div>
            </div>
            <div id="progress-bar-cover">
              <div id="progress">
                <div id="working">
                  Working<i className="fas fa-sync-alt fa-spin"></i>
                </div>
                <div id="acc-success">
                  Account Created<i className="fas fa-check"></i>
                  <span id="init-login">Login now</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
