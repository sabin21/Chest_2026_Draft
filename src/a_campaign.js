import '../public/styles/normalize.css'
import '../public/styles/common.css'
import '../public/styles/type_a.css'
import '../public/styles/a_campaign.scss'

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mario = document.getElementById("mario");
const body = document.body;


ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
        body.style.setProperty("--progress", self.progress * 100);
        if (self.progress > 0.95) {
            body.classList.add("final");
            mario.style.setProperty("--boost", "-35px");
        } else {
            body.classList.remove("final");
            mario.style.setProperty("--boost", "0px");
        }
    }
});

gsap.to("body", {
    opacity: 1,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.05,
        onScrubComplete: () => {
            mario.style.setProperty("--animation", "stand");
        },
        onUpdate: ({ getVelocity }) => {
            mario.style.setProperty("--animation", "run");
            if (getVelocity() < 1) {
                mario.style.setProperty("--flip", "-1");
            } else {
                mario.style.setProperty("--flip", "1");
            }
            const speed = Math.abs(Math.round(getVelocity()));
            mario.style.setProperty("--speed", speed);
        }
    }
});


gsap.utils.toArray(".marker").forEach((marker, index) => {
    gsap.to(this, {
        scrollTrigger: {
            trigger: marker,
            start: "top 0%",
            end: "bottom 0%",
            scrub: 0,
            onUpdate: (self) => {
                if (self.progress < 0.5) {
                    mario.style.setProperty("--progress", self.progress);
                } else {
                    mario.style.setProperty("--progress", 1 - self.progress);
                    body.classList.add("coin" + index);
                }
            },
            onEnter: () => {
                body.classList.add("jump");
            },
            onEnterBack: () => {
                body.classList.add("jump");
            },
            onLeave: () => {
                body.classList.remove("jump");
                body.classList.remove("coin" + (index + 1));
            },
            onLeaveBack: () => {
                body.classList.remove("jump");
                body.classList.remove("coin" + (index + 1));
            }
        }
    });
});
/*
gsap.to("body", {
    opacity: 1,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.05,
        onScrubComplete: () => {
            mario.style.setProperty("--animation", "stand");
        },
        onUpdate: ({ getVelocity }) => {
            mario.style.setProperty("--animation", "run");
            if (getVelocity() < 1) {
                mario.style.setProperty("--flip", "-1");
            } else {
                mario.style.setProperty("--flip", "1");
            }
            const speed = Math.abs(Math.round(getVelocity()));
            mario.style.setProperty("--speed", speed);
        }
    }
});

document.addEventListener(
    "DOMContentLoaded",
    function () {
        body.classList.add("loaded");
    },
    false
);

body.addEventListener(
    "click",
    function () {
        body.classList.toggle("loaded");
    },
    false
);

*/