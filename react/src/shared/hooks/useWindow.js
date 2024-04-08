import { useState, useEffect } from "react";

const useWindow = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [deviceOrientation, setDeviceOrientation] = useState(windowSize.width - windowSize.height);


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    // const handleOrientationChange = () => {
    //   setDeviceOrientation(mql.matches)
    // }

    window.addEventListener('resize', handleResize);
    // window.addEventListener('orientationchange', () => {
    //   setDeviceOrientation(mql.matches)
    // });

    return () => {
      window.removeEventListener('resize', handleResize)
      // window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {windowWidth: +windowSize.width, windowHeight: +windowSize.height, orientation: (windowSize.width - windowSize.height < 0)};
}

export default useWindow;