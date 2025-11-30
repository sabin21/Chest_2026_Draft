import '../public/styles/normalize.css'
import '../public/styles/common.css'
import '../public/styles/type_a.css'

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

gsap.to(".hero-item-present", {
    top: "140px",
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
        gsap.to(".hero-item-present", {
            y: 20,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }
});

gsap.to(".hero-item-block", {
    top: "170px",
    duration: 1,
    delay: 0.25,
    ease: "power2.out",
    onComplete: () => {
        gsap.to(".hero-item-block", {
            y: 20,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }
});

gsap.from(".collsion-item", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.7)",
    onComplete: () => {
        gsap.to(".collsion-item", {
            scaleY: 0.9,
            transformOrigin: "bottom center",
            duration: 0.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }
});

const cardSectionTl = gsap.timeline();

ScrollTrigger.create({
    trigger: ".section-3",
    start: "top top",
    end: "+=700",
    pin: true,
    animation: cardSectionTl
        .to(".full-pict-big-title", {
            opacity: 0,
            letterSpacing: "20px",
            delay: 0.2,
        })
        .to(".full-pict-title .title-text", {
            transform: "translateY(0)",
        })
        .to(".full-pict-overlay", {
            opacity: 0.6,
        }, 0)
        .to(".card-full-pict", {
            top: "120px", left: "calc(50% - 744px)",
            width: "860px", height: "520px", borderRadius: "20px",
            ease: "power2.out"
        }),
    scrub: 1,
    // onEnter: () => {
    //     document.querySelector('.card-full-pict').classList.remove('state-full');
    // },
    // onLeaveBack: () => {
    //     document.querySelector('.card-full-pict').classList.add('state-full');
    // }
});
