/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

export default function OddsHubCentral() {
  //const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  // Track mouse position for background effect
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

  // Placeholder market images that will float
  const marketImages = [
    {
      id: 1,
      position: { x: mobileDevice ? 5 : 15, y: mobileDevice ? 10 : 20 },
      size: mobileDevice ? 50 : 100,
      image:
        "https://media-hosting.imagekit.io/031dd2689cd34a9d/trumpXTariff.jpg?Expires=1838883324&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Ak1pmwVqRe0bYWCUEiCSIRGUkc4eWMcEZ4LZHsZXcj9vK84OiJWqUCE34NOTP~~45o1ZL3KKQzLFF7izjv8hqJeaRetuIbkKEvPRLUkpWGE~QytT6W3v5oFJwYS80sC1bSNcEqDXOKJx0KrTuxok0k86tJXuKb3upURCtUO8MiR3em6bZ3twEt2lMztXnN0RZM55647C30mstD0VT9~~3FAUyzpuQdMhBGsqclAbktGgtbFwfVirKpeq5n-Ze3G6uVZmhTPlmMhBqX1S4th-hOFx7J5sMow8wwiz7vZxk2CGPoKrsPAA6wxGyivHrwRzi~nqA5Y6nAYDSJGSGyLm1Q__",
    },
    {
      id: 2,
      position: { x: 85, y: 60 },
      size: mobileDevice ? 55 : 120,
      image:
        "https://media-hosting.imagekit.io/ed1bdc27ca594e3c/solana.png?Expires=1840642892&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lEX1QCiJ84T-VL3JnFch6My~NPfCLHFTIzpMynZCPf2YYXQR2Ak~aSV2ECQKZLyKe2yNpZa61Se1vIbBPbYHaQ9f7BehIr-e7Hc6JQjY0m2Ocnip~Uw5bF0RXer-qYkvwz9s6TeX5aYUmf0xH7-yUDh2VioR2RT9gIPC6IhjwTcMGdYeG4WaraCZkrLcc-ook73~f0Eve3SgD~ofkXOeOqvOPSnGJQtk~MNRQ66Bcm3T535m-vFXnwN9kJvbEzheUjVe-lOtKFCittdDrG-llmBdtdJhOWf~w8r7QMI58wH07W0Cq0s2GN7~uyS6LRQIrhnhpeKD7ZgWacbFTVP1tA__",
    },
    {
      id: 3,
      position: { x: 25, y: 70 },
      size: mobileDevice ? 55 : 95,
      image:
        "https://media-hosting.imagekit.io/169675aaf79c4256/rvsu.png?Expires=1840643195&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=NroFU8NFtrI77TNJXn9H64vKTuyzKrQr4eNQiRljfy-zSv53QpiWG96bUQWIAxkvN-FQEDgWYjbsN0Q15T4QfSTvflK0a96Ueqej4gmIy54Ax-QWt~Ou3QfNSflQJNhLhnLsSCKe8AMSTiaXSuIAXl1dxN6I~F2jJY9IAN2ksmIKTW8M4lqWhZ48vVYcfhb9Bu2UjCPKZ0xW3vdb~MpY~7Q6AVXL1wEEiT0PLMWfI7aszsaS6r8jbmgIaabKrw3UtGBdNQ6sfYwMdLp4fVMWm3fMweFQ~vgDX~RZXNsjkGvnRUPZizU9bWOQpat-gf1Z23Ti65INgZDggXK1lsMxuQ__",
    },
    {
      id: 4,
      position: { x: 75, y: 15 },
      size: mobileDevice ? 65 : 125,
      image:
        "https://media-hosting.imagekit.io/ec75493b6746491e/rcb.jpg?Expires=1838971098&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=VPJCCXvdOXLF-Up5QOTB9XiDq9E27VHVxjkAYL2kwR2KkNkeYRCGrDcG1XIW53nYGdvaqmxJrOz9ibqWvSSkZJLcO3Ytn9yfLuV5ZpwdXaLREKTIRZ2pN9GyjyUJHUchDhUjNojY3iqFkaeIBqzTz8ibJUJus9U6s3cI-B0woV-JGPisOOsPkdoCPy67z~0YPMyaKAuVTLDrf5oijQQY~L5maV2lVxol-eUSLTweyp6HF2CcquUARU26l5Cau-10F48UALvRFIxzdbt0xHz4XM~AHJIOxPPLf6Q8GiXx6JSWlERxzZ7uJe68AGbJ4tS5I-LEpDCq~fC2nI3NHnaEKQ__",
    },
    {
      id: 5,
      position: { x: 45, y: 25 },
      size: mobileDevice ? 85 : 75,
      image:
        "https://media-hosting.imagekit.io/79717cfc320142e6/btc-logo.webp?Expires=1838970376&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=sFm1rl0ECMpvzkPBGEyJ2XEQ3Ibox57cLB3h2fT4Ohn06Cxzsk0LiaCnrZyjcdC~EVxo6x5iSpD9sKPQQCka4UNc~Kt2jYT~5JzGop6E5znb4K5vsNmWZuKhgdHenEqxtrhRYqqbBQlpysLkPTRx0nFa-QkjcP2UXszU68AO0g4vxIxuVb-u0kpJIOSkpbsbdyUXU5zwzTdbxviDd02BkM5Nr4Nd6Fv10nciNpP3J5ARmVnD-2gXlwvCKZPpfSlgAo7iTyVCdrqa6mRks4s7~L5IO82VRTKtn-mDMqlZYe8F5S4MTwPYcYl8TOvX6TcEBhlo-bjwOkXsjPRrxU2iTw__",
    },
    {
      id: 6,
      position: { x: 5, y: 85 },
      size: mobileDevice ? 45 : 75,
      image:
        "https://media-hosting.imagekit.io/80e1e56fa0c943c7/usdc_new.png?Expires=1839217737&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=qXvClgWu67vLyWr7aqcLSbieKj5v6I3Vs2-Sq3U1OJJJgb~0tfcbba1E~hbqOfQtdRRJs3s~yGjhFQ59cZCrjJ0SrWCBAL2t~~fZBaBXwrdEU3PuW8o6Il~zGRB~RYmJ54pY6Ok0OmjBA0NjqHlK4ghEvk9PlHTZQBMenhIlS5wn2pcry6XLU2eA8KypE2lQnBOGa2~PsZGsizrLQHXrWk43v5ml10tVUTXJicKzvM5sojgLRUKDYdC03MCxqn1ocKpE4dZ~WvDu8FVA4YSQwoaPY~vumlRPkMIRVnu5luzF0YIYuwUqbNbeeuWu2wZRf59CnCZ573~brIqHvH7neA__",
    },
  ];

  // New improved slogan
  const slogan = "Where Predictions Meet Profits";
  const sloganChars = slogan.split("");

  return (
    // <div
    //   className="relative w-full py-12 md:py-20 lg:py-24 bg-[rgb(15,23,42)] overflow-hidden"
    //   ref={containerRef}
    // >
    //   {/* Interactive background effect */}
    //   <motion.div
    //     className="absolute inset-0 opacity-30"
    //     animate={{
    //       background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.15) 0%, transparent 60%)`,
    //     }}
    //     transition={{ duration: 0.3, ease: "easeOut" }}
    //   />

    //   {/* Floating market images */}
    //   {marketImages.map((image) => (
    //     <motion.div
    //       key={image.id}
    //       className="absolute rounded-full bg-gradient-to-r from-[rgb(30,58,138)] to-blue-400 opacity-70 backdrop-blur-sm overflow-hidden shadow-lg"
    //       style={{
    //         left: `${image.position.x}%`,
    //         top: `${image.position.y}%`,
    //         width: image.size,
    //         height: image.size,
    //       }}
    //       animate={{
    //         y: [0, -15, 0],
    //         x: [0, 10, 0],
    //         rotate: [0, 5, 0],
    //         scale: [1, 1.05, 1],
    //       }}
    //       transition={{
    //         duration: 5 + Math.random() * 3,
    //         repeat: Number.POSITIVE_INFINITY,
    //         repeatType: "reverse",
    //         ease: "easeInOut",
    //       }}
    //       whileHover={{
    //         scale: 1.1,
    //         boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
    //       }}
    //     >
    //       {/* Image container with proper sizing */}
    //       <div className="w-full h-full rounded-full overflow-hidden border-2 border-blue-300/30">
    //         <Image
    //           src={image.image || "/placeholder.svg"}
    //           height={200}
    //           width={200}
    //           alt="Market image"
    //           className="w-full h-full object-cover"
    //           style={{ width: "100%", height: "100%" }}
    //         />
    //       </div>
    //     </motion.div>
    //   ))}

    //   <div className="container relative z-10 px-4 md:px-6 mx-auto">
    //     <div className="flex flex-col items-center justify-center space-y-6 text-center">
    //       <motion.div
    //         className="space-y-4"
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ duration: 0.8 }}
    //       >
    //         <motion.div className="bg-gradient-to-r from-white-600 to-white-600 p-1 rounded-lg shadow-lg inline-block mb-2">
    //           <h2 className="text-xl md:text-2xl font-bold tracking-wide bg-[rgb(15,23,42)] px-6 py-2 rounded-md">
    //             <span className="bg-gradient-to-r from-white-400 to-white-300 bg-clip-text text-white">
    //               Welcome to OddsHub
    //             </span>
    //           </h2>
    //         </motion.div>

    //         {/* Animated slogan with letter reveal */}
    //         <div className="mx-auto max-w-[700px] text-gray-300 text-xl md:text-2xl overflow-hidden mt-3">
    //           <div className="flex justify-center flex-wrap">
    //             {sloganChars.map((char, index) => (
    //               <motion.span
    //                 key={index}
    //                 initial={{ opacity: 0, y: 20 }}
    //                 animate={{ opacity: 1, y: 0 }}
    //                 transition={{
    //                   duration: 0.3,
    //                   delay: 0.8 + index * 0.05,
    //                   ease: "easeOut",
    //                 }}
    //                 className={char === " " ? "mr-2" : ""}
    //               >
    //                 {char}
    //               </motion.span>
    //             ))}
    //           </div>
    //           <motion.p
    //             className="mt-4 text-blue-300/80 text-lg"
    //             initial={{ opacity: 0 }}
    //             animate={{ opacity: 1 }}
    //             transition={{ delay: 1.5, duration: 0.8 }}
    //           >
    //             Your gateway to the future of prediction markets
    //           </motion.p>
    //         </div>
    //       </motion.div>

    //       {/* Call to action buttons */}
    //       <motion.div
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ delay: 1.8, duration: 0.5 }}
    //         className="flex flex-col sm:flex-row gap-4 mt-2"
    //       ></motion.div>
    //     </div>
    //   </div>

    //   {/* Enhanced background effects */}
    //   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.2),transparent_70%)]"></div>
    //   <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[rgb(15,23,42)] to-transparent"></div>

    //   {[...Array(20)].map((_, i) => (
    //     <motion.div
    //       key={i}
    //       className="absolute w-1 h-1 rounded-full bg-blue-400/30"
    //       style={{
    //         left: `${Math.random() * 100}%`,
    //         top: `${Math.random() * 100}%`,
    //       }}
    //       animate={{
    //         y: [0, -30, 0],
    //         opacity: [0, 1, 0],
    //       }}
    //       transition={{
    //         duration: 3 + Math.random() * 5,
    //         repeat: Number.POSITIVE_INFINITY,
    //         delay: Math.random() * 5,
    //       }}
    //     />
    //   ))}
    // </div>
    <div className="CentralComponent relative w-full h-[200px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] 2xl:h-[500px] mb-5">
  <Image
    src="/assets/logos/oddshub_bg.jpeg"
    alt="OddsHub Background"
    className="object-contain w-full h-full absolute inset-0"
    fill
    priority
  />
  {/* Your content with relative/absolute positioning */}
</div>
  )
}
