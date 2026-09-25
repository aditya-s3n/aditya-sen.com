'use client';

import styles from "./Procedrual3D.module.css";
import { useEffect, useRef } from "react";

// vertex shader
const vertex_shader = `


`;

// fragment shader
const fragment_shader = `

`;


export default function Procedural3D() {
    const containerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {




        
    }, []);




    return <div ref={containerRef} style={styles}/>

}