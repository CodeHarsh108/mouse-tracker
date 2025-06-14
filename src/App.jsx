import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, Zap, Target, TrendingUp } from 'lucide-react';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseTrail, setMouseTrail] = useState([]);
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const trailIdRef = useRef(0);
  const movingTimeoutRef = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const newPosition = { x: event.clientX, y: event.clientY };
      const currentTime = Date.now();

      const deltaX = newPosition.x - lastPositionRef.current.x;
      const deltaY = newPosition.y - lastPositionRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const deltaTime = currentTime - lastTimeRef.current;
      const speed = deltaTime > 0 ? (distance / deltaTime) * 10 : 0;

      setMousePosition(newPosition);
      setMouseSpeed(speed);
      setTotalDistance(prev => prev + distance);
      setIsMouseMoving(true);

      if (distance > 3) {
        setMouseTrail(prev => {
          const newTrail = [...prev, { ...newPosition, id: trailIdRef.current++ }];
          return newTrail.slice(-12);
        });
      }

      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current);
      }

      movingTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
        setMouseSpeed(0);
      }, 150);

      lastPositionRef.current = newPosition;
      lastTimeRef.current = currentTime;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current);
      }
    };
  }, []);

  const resetStats = () => {
    setTotalDistance(0);
    setMouseTrail([]);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B1D51 0%, #725CAD 35%, #8CCDEB 70%, #FFE3A9 100%)'
      }}
    >
      {/* Background animations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse" style={{ backgroundColor: '#725CAD' }} />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-12 animate-pulse" style={{ backgroundColor: '#8CCDEB', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 animate-pulse" style={{ backgroundColor: '#FFE3A9', animationDelay: '4s' }} />
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-32 w-4 h-4 rotate-45 animate-float opacity-40" style={{ backgroundColor: '#725CAD', animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-40 w-6 h-6 rounded-full animate-float opacity-35" style={{ backgroundColor: '#8CCDEB', animationDelay: '2.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 rotate-45 animate-float opacity-30" style={{ backgroundColor: '#FFE3A9', animationDelay: '0.5s' }} />
        <div className="absolute top-2/3 right-1/3 w-5 h-5 rounded-full animate-float opacity-25" style={{ backgroundColor: '#725CAD', animationDelay: '3s' }} />
      </div>

      {/* Mouse Trail */}
      {mouseTrail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-10"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            opacity: (index + 1) / mouseTrail.length * 0.8,
            transform: `scale(${(index + 1) / mouseTrail.length * 0.9 + 0.3})`,
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          }}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{
              background: 'linear-gradient(45deg, #725CAD, #8CCDEB)',
              filter: 'blur(1px)'
            }}
          />
        </div>
      ))}

      {/* Custom Cursor */}
      <div
        className="fixed pointer-events-none z-20"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${isMouseMoving ? 1.4 : 1})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div
          className={`w-6 h-6 border-3 rounded-full transition-all duration-100 ${isMouseMoving ? 'shadow-2xl' : 'shadow-lg'}`}
          style={{
            borderColor: '#725CAD',
            background: isMouseMoving ? 'linear-gradient(45deg, #725CAD, #8CCDEB)' : 'rgba(114, 92, 173, 0.3)',
            boxShadow: isMouseMoving
              ? '0 0 30px rgba(114, 92, 173, 0.6), 0 0 60px rgba(140, 205, 235, 0.4)'
              : '0 0 15px rgba(114, 92, 173, 0.3)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="animate-bounce-gentle">
              <MousePointer2 className="w-12 h-12" style={{ color: '#FFE3A9' }} />
            </div>
            <h1
              className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(45deg, #FFE3A9, #8CCDEB)'
              }}
            >
              Mouse Tracker
            </h1>
          </div>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up font-medium" style={{ color: '#8CCDEB' }}>
            Beautiful mouse tracking with stunning visual effects and real-time analytics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
          {/* Position */}
          <StatCard
            icon={<Target className="w-7 h-7" style={{ color: '#FFE3A9' }} />}
            title="Position"
            color="#8CCDEB"
            content={
              <>
                <StatRow label="X Coordinate" value={`${mousePosition.x.toFixed(0)}px`} />
                <StatRow label="Y Coordinate" value={`${mousePosition.y.toFixed(0)}px`} />
              </>
            }
            bgColor="rgba(11, 29, 81, 0.85)"
            borderColor="#8CCDEB"
            delay="0.1s"
          />

          {/* Speed */}
          <StatCard
            icon={<Zap className={`w-7 h-7 ${isMouseMoving ? 'animate-pulse' : ''}`} style={{ color: '#8CCDEB' }} />}
            title="Speed"
            color="#FFE3A9"
            content={
              <>
                <StatRow label="Current" value={mouseSpeed.toFixed(1)} />
                <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: 'rgba(140, 205, 235, 0.3)' }}>
                  <div className="h-full transition-all duration-300 rounded-full" style={{
                    width: `${Math.min(mouseSpeed * 2, 100)}%`,
                    background: 'linear-gradient(90deg, #FFE3A9, #8CCDEB)'
                  }} />
                </div>
              </>
            }
            bgColor="rgba(114, 92, 173, 0.85)"
            borderColor="#FFE3A9"
            delay="0.2s"
          />

          {/* Distance */}
          <StatCard
            icon={<TrendingUp className="w-7 h-7" style={{ color: '#0B1D51' }} />}
            title="Distance"
            color="#0B1D51"
            content={
              <>
                <StatRow label="Total" value={`${(totalDistance / 100).toFixed(1)}m`} />
                <div className="text-sm" style={{ color: '#725CAD' }}>
                  {totalDistance.toFixed(0)} pixels traveled
                </div>
              </>
            }
            bgColor="rgba(140, 205, 235, 0.85)"
            borderColor="#725CAD"
            delay="0.3s"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={resetStats}
          className="group relative px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 animate-bounce-subtle"
          style={{
            background: 'linear-gradient(45deg, #725CAD, #8CCDEB)',
            color: '#0B1D51',
            boxShadow: '0 15px 40px rgba(114, 92, 173, 0.4)'
          }}
        >
          <span className="relative z-10">Reset Statistics</span>
          <div
            className="absolute inset-0 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"
            style={{ background: 'linear-gradient(45deg, #8CCDEB, #FFE3A9)' }}
          />
        </button>

        {/* Instructions */}
        <div className="mt-12 text-center animate-fade-in-delayed">
          <p className="text-lg font-medium" style={{ color: '#8CCDEB' }}>
            Move your mouse to create beautiful trails ✨
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-20px) rotate(270deg); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.5s both;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ icon, title, color, content, bgColor, borderColor, delay }) => (
  <div
    className="backdrop-blur-lg rounded-3xl p-8 border-2 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-up"
    style={{ backgroundColor: bgColor, borderColor: borderColor, animationDelay: delay }}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold" style={{ color }}>{title}</h3>
    </div>
    <div className="space-y-4">{content}</div>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-lg font-medium" style={{ color: '#725CAD' }}>{label}:</span>
    <span className="text-3xl font-mono font-bold transition-all duration-200" style={{ color: '#FFE3A9' }}>
      {value}
    </span>
  </div>
);

export default App;
