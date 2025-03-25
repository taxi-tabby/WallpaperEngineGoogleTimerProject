import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

const DraggableWidget: React.FC = () => {
    const [position, setPosition] = useState({ x: 200, y: 200 });
    const draggableRef = useRef<HTMLDivElement | null>(null);

    const handleStart = (event: DraggableEvent, data: DraggableData) => {
        // console.log('Event: ', event);
        // console.log('Data: ', data);
    };

    const handleDrag = (event: DraggableEvent, data: DraggableData) => {
        // console.log('Event: ', event);
        // console.log('Data: ', data);
    };

    const handleStop = (event: DraggableEvent, data: DraggableData) => {
        // console.log('Event: ', event);
        // console.log('Data: ', data);
        setPosition({ x: data.x, y: data.y }); // update the position state
    };

    const width = 330;
    const height = 330;

    const numberDistance = 30;
    const stickDistance = 50;
    const leftPadPx = -4.9;
    const topPadPx = -4.9;

    const redCircleSizeRate = 0.77;
    const redCircleWidth = width * redCircleSizeRate;
    const redCircleHeight = height * redCircleSizeRate;

    const maxMinute = 60;
    const [currentMinute, setCurrentMinute] = useState(60);

    const tiltSensitive = 5;

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const [uicover, setUicover] = useState(false);
    const [completeCover, setCompleteCover] = useState(false);

    const calculateRotation = () => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const rotateX = ((mousePosition.y - centerY) / centerY) * tiltSensitive;
        const rotateY = ((mousePosition.x - centerX) / centerX) * -tiltSensitive;
        return { rotateX, rotateY };
    };

    const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 60 seconds
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = (second: number) => {

        if (second < 0) {
            console.warn("Negative values are not allowed for the timer.");
            return;
        }

        const validSecond = Math.min(second, maxMinute);
        setTimeLeft(validSecond);
        setCurrentMinute(maxMinute - validSecond);

        if (!isRunning) {
            setIsRunning(true);
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(timeLeft);
        setCurrentMinute(maxMinute - timeLeft);
    };

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
                setCurrentMinute((prevSecond) => prevSecond + 1);
            }, 1000 * 60);
        } else if (timeLeft === 0) {
            setIsRunning(false);

            console.log('Timer expired');
            setCompleteCover(true);
            setTimeout(() => {
                setCompleteCover(false);
            }, 3000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, timeLeft]);


    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);


    return (

        <>
            {
                (completeCover) && (
                    <div
                        className='fixed inset-0 w-full h-full bg-black'
                        style={{
                            animation: 'blink 0.01s infinite',
                        }}
                    >
                        <style>
                            {`
                                @keyframes blink {
                                    0%, 100% {
                                        background-color: #000;
                                    }
                                    4% {
                                        background-color: #333;
                                    }
                                    12% {
                                        background-color: #ff0000;
                                    }
                                    24% {
                                        background-color: #333;
                                    }
                                }
                            `}
                        </style>
                    </div>
                )
            }
            <Draggable
                // axis="x"
                handle=".handle"
                defaultPosition={{ x: 0, y: 0 }}
                position={position} // bind the state position here
                grid={[12, 12]}

                scale={1}
                onStart={handleStart}
                onDrag={handleDrag}
                onStop={handleStop}
                bounds={undefined}
                nodeRef={draggableRef as React.RefObject<HTMLElement>}  // Use nodeRef here to prevent findDOMNode
            >
                <div ref={draggableRef}>

                    {/* <div className="handle text-white">test Handle {mousePosition.x} / {mousePosition.y}</div> */}




                    <div
                        style={{
                            width: width,
                            height: height,
                            borderRadius: '25%',
                            border: '5px solid gray',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            transform: `perspective(300px) rotateX(${-calculateRotation().rotateX}deg) rotateY(${-calculateRotation().rotateY}deg)`,
                        }}
                        className='bg-white handle'
                    >


                        {
                            (uicover) && (
                                <div className='absolute -inset-[6px] rounded-2xl z-[20] bg-black border-[#323232] border-[2px]'>

                                    <div className="flex flex-col items-center justify-center h-full text-white">
                                        <div className="mb-4">
                                            <label htmlFor="timerInput" className="block text-sm font-medium">
                                                Set Timer (minutes):
                                            </label>
                                            <input
                                                id="timerInput"
                                                type="text"
                                                min="0"
                                                max={maxMinute}
                                                value={timeLeft}
                                                onChange={(e) => {
                                                    let minutes = parseInt(e.target.value, 10);
                                                    minutes = isNaN(minutes) ? 0 : minutes;

                                                    setIsRunning(false);
                                                    if (!isNaN(minutes)) {


                                                        minutes = Math.min(minutes, maxMinute);
                                                        minutes = Math.max(minutes, 0);

                                                        setTimeLeft(minutes);
                                                        setCurrentMinute(maxMinute - minutes);
                                                    }
                                                }}
                                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="flex space-x-2 mb-2">
                                            <button
                                                onClick={() => {
                                                    setIsRunning(false);
                                                    let minutes = timeLeft + 1;
                                                    minutes = Math.min(minutes, maxMinute);
                                                    minutes = Math.max(minutes, 0);

                                                    setTimeLeft(minutes);
                                                    setCurrentMinute(maxMinute - minutes);
                                                }}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#333] rounded-md"
                                            >
                                                 +1 M
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsRunning(false);
                                                    let minutes = timeLeft + 5;
                                                    minutes = Math.min(minutes, maxMinute);
                                                    minutes = Math.max(minutes, 0);

                                                    setTimeLeft(minutes);
                                                    setCurrentMinute(maxMinute - minutes);
                                                }}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#333] rounded-md"
                                            >
                                                 +5 M
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setIsRunning(false);
                                                    let minutes = timeLeft - 1;
                                                    minutes = Math.min(minutes, maxMinute);
                                                    minutes = Math.max(minutes, 0);

                                                    setTimeLeft(minutes);
                                                    setCurrentMinute(maxMinute - minutes);
                                                }}
                                                className="px-4 py-2 bg-[#360606] hover:bg-[#360606] text-[#fafafa] rounded-md"
                                            >
                                                 -1 M
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsRunning(false);
                                                    let minutes = timeLeft - 5;
                                                    minutes = Math.min(minutes, maxMinute);
                                                    minutes = Math.max(minutes, 0);

                                                    setTimeLeft(minutes);
                                                    setCurrentMinute(maxMinute - minutes);
                                                }}
                                                className="px-4 py-2 bg-[#360606] hover:bg-[#360606] text-[#fafafa] rounded-md"
                                            >
                                                 -5 M
                                            </button>

                                            
                                        </div>

                                        <div className="flex space-x-2 mb-4">

                                            
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => {
                                                    startTimer(timeLeft);
                                                    setUicover(false);
                                                }}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                            >
                                                Start
                                            </button>
                                            <button
                                                onClick={() => {
                                                    resetTimer();
                                                    setUicover(false);
                                                }}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                            >
                                                Stop
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setUicover(false);
                                                }}
                                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )
                        }



                        {/* 시간 표시 */}
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 30) * (Math.PI / 180);
                            const x = (width / 2) + ((height / 2) - numberDistance) * Math.sin(angle); // Adjust position with distance
                            const y = (width / 2) - ((height / 2) - numberDistance) * Math.cos(angle); // Adjust position with distance
                            return (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        left: `${(x + leftPadPx)}px`,
                                        top: `${(y + topPadPx)}px`,
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {(i === 0 ? 0 : 60 - i * 5)}
                                </div>
                            );
                        })}

                        {/* 분 마다 점선 */}
                        {[...Array(60)].map((_, i) => {
                            const angle = (i * 6) * (Math.PI / 180); // 6 degrees for each minute
                            const x1 = (width / 2) + ((height / 2) - stickDistance) * Math.sin(angle);
                            const y1 = (width / 2) - ((height / 2) - stickDistance) * Math.cos(angle);
                            const x2 = (width / 2) + (height / 2) * Math.sin(angle);
                            const y2 = (width / 2) - (height / 2) * Math.cos(angle);
                            return (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        left: `${(x1 + leftPadPx)}px`,
                                        top: `${(y1 + topPadPx)}px`,
                                        backgroundColor: i % 5 === 0 ? 'black' : 'gray', // Bold for 5-minute intervals
                                        borderRadius: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: i % 5 === 0 ? '4px' : '2px',
                                        height: i % 5 === 0 ? '4px' : '2px',
                                    }}
                                />
                            );
                        })}




                        {/* red curcle */}
                        {currentMinute != maxMinute && (
                            <svg
                                width={redCircleWidth}
                                height={redCircleHeight}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <defs>
                                    <mask id="cutout">
                                        <rect width="100%" height="100%" fill="white" />
                                        <path
                                            d={`M${redCircleWidth / 2},${redCircleHeight / 2} L${redCircleWidth / 2},0 A${redCircleWidth / 2},${redCircleHeight / 2} 0 ${currentMinute > 30 ? 1 : 0},1 ${redCircleWidth / 2 + (redCircleWidth / 2) * Math.sin((currentMinute / maxMinute) * 2 * Math.PI)},${redCircleHeight / 2 - (redCircleHeight / 2) * Math.cos((currentMinute / maxMinute) * 2 * Math.PI)} Z`}
                                            fill="black"
                                        />
                                    </mask>
                                </defs>
                                <circle
                                    cx={redCircleWidth / 2}
                                    cy={redCircleHeight / 2}
                                    r={(redCircleWidth / 2) - 10} // Adjust radius for the circle
                                    fill="red"
                                    mask="url(#cutout)"
                                />
                            </svg>
                        )}


                        {/* white btn */}
                        <div
                            onClick={() => {
                                setUicover(!uicover);
                            }}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 20% 20%, #aaa, #fafafa)', // Gradient to simulate light source
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3), -0px -0px 20px rgba(3, 0, 100, 0.7)', // Soft shadow with highlight
                                zIndex: 10,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transition for hover effect
                            }}
                            className="hover:scale-110 hover:shadow-2xl cursor-pointer"
                        >
                        </div>



                        {/* 침 */}
                        {/* <div style={{
                        width: '6px',
                        height: '120px',
                        backgroundColor: 'black',
                        position: 'absolute',
                        top: '0',
                        transformOrigin: 'bottom',
                        transform: 'rotate(0deg)',
                        transition: 'transform 0.5s linear'
                    }} 
                    /> */}


                    </div>

                </div>
            </Draggable>
        </>


    );
};

export default DraggableWidget;
