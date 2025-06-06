"use client"
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
export default function OddsHubCentral() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  
  const marketImages = [
    {
      id: 1,
      position: { x: mobileDevice ? 5 : 15, y: mobileDevice ? 10 : 20 },
      size: mobileDevice ? 50 : 100,
      image:
        "/assets/logos/trump.svg",
    },
    {
      id: 2,
      position: { x: 85, y: 60 },
      size: mobileDevice ? 55 : 120,
      image:
        "/assets/logos/btc.svg",
    },
    {
      id: 3,
      position: { x: 25, y: 70 },
      size: mobileDevice ? 55 : 95,
      image:
        "/assets/logos/eth.svg",
    },
    {
      id: 4,
      position: { x: 75, y: 15 },
      size: mobileDevice ? 65 : 125,
      image:
        "/assets/logos/nba.svg",
    },
    {
      id: 5,
      position: { x: 55, y: 75 },
      size: mobileDevice ? 85 : 75,
      image:
        "/assets/logos/club.svg",
    },
    {
      id: 6,
      position: { x: 5, y: 65 },
      size: mobileDevice ? 45 : 75,
      image:
        "/assets/logos/usdc.svg",
    },
  ];


  const slogan = "Where Predictions Meet Profits";
  const sloganChars = slogan.split("");

  
  return (
    <div
      className="relative w-full py-12 md:py-20 lg:py-24 bg-[rgb(15,23,42)] overflow-hidden"
      ref={containerRef}
    >
    
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.15) 0%, transparent 60%)`,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {marketImages.map((image) => (
        <motion.div
          key={image.id}
          className="absolute rounded-full bg-gradient-to-r from-[rgb(30,58,138)] to-blue-400 opacity-70 backdrop-blur-sm overflow-hidden shadow-lg"
          style={{
            left: `${image.position.x}%`,
            top: `${image.position.y}%`,
            width: image.size,
            height: image.size,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-blue-300/30">
            <Image
              src={image.image || "/placeholder.svg"}
              height={200}
              width={200}
              alt="Market image"
              className="w-full h-full object-cover"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </motion.div>
      ))}

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className="bg-gradient-to-r from-white-600 to-white-600 p-1 rounded-lg shadow-lg inline-block mb-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-wide px-6 py-2 rounded-md">
                <span className="bg-gradient-to-r from-white-400 to-white-300 bg-clip-text text-white">
                  Welcome to OddsHub
                </span>
              </h2>
            </motion.div>

            {/* Animated slogan with letter reveal */}
            <div className="mx-auto max-w-[700px] text-gray-300 text-xl md:text-2xl overflow-hidden mt-3">
              <div className="flex justify-center flex-wrap">
                {sloganChars.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.8 + index * 0.05,
                      ease: "easeOut",
                    }}
                    className={char === " " ? "mr-2" : ""}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              <motion.p
                className="mt-4 text-blue-300/80 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Your gateway to the future of prediction markets
              </motion.p>
            </div>
          </motion.div>

          {/* Call to action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          ></motion.div>
        </div>
      </div>

      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.2),transparent_70%)]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[rgb(15,23,42)] to-transparent"></div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}