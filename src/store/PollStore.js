import { writable } from "svelte/store";


export const PollStore= writable(
        [
            {
                question: "python or js",
                answer1: "python",
                answer2: "js",
                vote1: 5,
                vote2: 10,
                id: 1, 
            },
            {
                question: "java or C++",
                answer1: "java",
                answer2: "C++",
                vote1: 12,
                vote2: 13,
                id: 2, 
            }
        ]
    );      
