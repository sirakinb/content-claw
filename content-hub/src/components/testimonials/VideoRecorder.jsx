import { useState, useRef, useCallback, useEffect } from 'react';
import { Video, Square, RotateCcw, Check, Circle, Pause, Play, Camera, MicOff } from 'lucide-react';

const STATES = { IDLE: 'idle', COUNTDOWN: 'countdown', RECORDING: 'recording', PAUSED: 'paused', PREVIEW: 'preview' };

export default function VideoRecorder({ maxDuration = 120, onComplete, brandColor = '#9333ea', prompt }) {
  const [state, setState] = useState(STATES.IDLE);
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const blobRef = useRef(null);
  const countdownRef = useRef(null);
  const stopRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (err) {
      setCameraReady(false);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera and microphone access to record.');
      } else {
        setError('Could not access camera. Please check your device settings.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [startCamera, stopCamera]);

  const doStop = useCallback(() => {
    clearInterval(timerRef.current);
    if (recorderRef.current?.state === 'recording' || recorderRef.current?.state === 'paused') {
      recorderRef.current.stop();
    }
  }, []);

  useEffect(() => { stopRef.current = doStop; }, [doStop]);

  const doStartRecording = useCallback(() => {
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setState(STATES.PREVIEW);
    };
    recorderRef.current = recorder;
    recorder.start(1000);
    setState(STATES.RECORDING);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= maxDuration) stopRef.current?.();
        return next;
      });
    }, 1000);
  }, [maxDuration]);

  const beginCountdown = useCallback(() => {
    setState(STATES.COUNTDOWN);
    setCountdown(3);
    let c = 3;
    countdownRef.current = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(countdownRef.current);
        doStartRecording();
      } else {
        setCountdown(c);
      }
    }, 1000);
  }, [doStartRecording]);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.pause();
      clearInterval(timerRef.current);
      setState(STATES.PAUSED);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current?.state === 'paused') {
      recorderRef.current.resume();
      setState(STATES.RECORDING);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= maxDuration) stopRef.current?.();
          return next;
        });
      }, 1000);
    }
  }, [maxDuration]);

  const retake = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    blobRef.current = null;
    setElapsed(0);
    setState(STATES.IDLE);
    startCamera();
  }, [videoUrl, startCamera]);

  const confirm = useCallback(() => {
    onComplete?.(blobRef.current);
  }, [onComplete]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progressPct = maxDuration > 0 ? Math.min((elapsed / maxDuration) * 100, 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      {/* Prompt Banner */}
      {prompt && state !== STATES.PREVIEW && (
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1.5 font-medium">Prompt</p>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light">{prompt}</p>
        </div>
      )}

      {/* Video Container */}
      <div className="relative aspect-[4/3] sm:aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/[0.08]">
        {state === STATES.PREVIEW && videoUrl ? (
          <video src={videoUrl} controls className="w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}

        {/* Countdown Overlay */}
        {state === STATES.COUNTDOWN && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-10">
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-white/20 flex items-center justify-center">
                <span className="text-7xl sm:text-8xl font-extralight text-white">{countdown}</span>
              </div>
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent animate-ping"
                style={{ borderColor: brandColor + '60' }}
              />
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {(state === STATES.RECORDING || state === STATES.PAUSED) && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 z-10">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${state === STATES.RECORDING ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-white/90 text-xs font-medium tracking-wide">
                {state === STATES.PAUSED ? 'PAUSED' : 'REC'}
              </span>
            </div>
          </div>
        )}

        {/* Timer */}
        {(state === STATES.RECORDING || state === STATES.PAUSED) && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <div className="bg-black/50 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-white/90 text-xs font-mono tracking-wider">
                {formatTime(elapsed)}<span className="text-white/30"> / {formatTime(maxDuration)}</span>
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {(state === STATES.RECORDING || state === STATES.PAUSED) && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-white/10 z-10">
            <div
              className="h-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${brandColor}, ${brandColor}cc)`,
                boxShadow: `0 0 12px ${brandColor}80`,
              }}
            />
          </div>
        )}

        {/* Error State */}
        {error && state === STATES.IDLE && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950 p-6">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <MicOff className="w-7 h-7 text-white/40" />
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{error}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-medium transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Camera Loading */}
        {!cameraReady && !error && state === STATES.IDLE && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Camera className="w-7 h-7 text-white/30" />
              </div>
              <p className="text-white/40 text-sm font-light">Accessing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
        {state === STATES.IDLE && cameraReady && (
          <button
            onClick={beginCountdown}
            className="group flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)`,
              boxShadow: `0 8px 32px ${brandColor}40`,
            }}
          >
            <div className="relative">
              <Circle className="w-5 h-5 fill-current" />
              <div className="absolute inset-0 rounded-full animate-ping opacity-30">
                <Circle className="w-5 h-5 fill-current" />
              </div>
            </div>
            Start Recording
          </button>
        )}

        {state === STATES.RECORDING && (
          <>
            <button
              onClick={pauseRecording}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs sm:text-sm font-medium backdrop-blur-xl border border-white/10 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span className="hidden sm:inline">Pause</span>
            </button>
            <button
              onClick={doStop}
              className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              Stop
            </button>
          </>
        )}

        {state === STATES.PAUSED && (
          <>
            <button
              onClick={resumeRecording}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs sm:text-sm font-medium backdrop-blur-xl border border-white/10 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
            <button
              onClick={doStop}
              className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              Finish
            </button>
          </>
        )}

        {state === STATES.PREVIEW && (
          <>
            <button
              onClick={retake}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs sm:text-sm font-medium backdrop-blur-xl border border-white/10 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button
              onClick={confirm}
              className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)`,
                boxShadow: `0 8px 32px ${brandColor}40`,
              }}
            >
              <Check className="w-5 h-5" />
              Use This Take
            </button>
          </>
        )}
      </div>
    </div>
  );
}
