
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Keychain3DViewer({ config }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const keychainRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const [expandedBadge, setExpandedBadge] = useState(null);

  const toggleBadge = (badgeType) => {
    setExpandedBadge(expandedBadge === badgeType ? null : badgeType);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, 0); // Zmieniono z (0, 0, 0) na (0, 1, 0) - kamera patrzy niżej
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Better lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(0, -3, -5);
    scene.add(backLight);

    createKeychain();

    function animate() {
      requestAnimationFrame(animate);
      if (keychainRef.current && !isDraggingRef.current) {
        keychainRef.current.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePosition.current = {
        x: e.clientX || e.touches?.[0]?.clientX,
        y: e.clientY || e.touches?.[0]?.clientY
      };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !keychainRef.current) return;
      
      const currentX = e.clientX || e.touches?.[0]?.clientX;
      const currentY = e.clientY || e.touches?.[0]?.clientY;
      
      const deltaX = currentX - previousMousePosition.current.x;
      const deltaY = currentY - previousMousePosition.current.y;

      keychainRef.current.rotation.y += deltaX * 0.01;
      keychainRef.current.rotation.x += deltaY * 0.01;

      // Ogranicz obrót X żeby nie wypadł poza ekran
      keychainRef.current.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, keychainRef.current.rotation.x));

      previousMousePosition.current = { x: currentX, y: currentY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Zoom przez pinch na telefonie
    let initialPinchDistance = null;
    let initialCameraZ = null;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        // Pinch start
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
        initialCameraZ = cameraRef.current.position.z;
      } else if (e.touches.length === 1) {
        handleMouseDown(e);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialPinchDistance && cameraRef.current) {
        // Pinch zoom
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const scale = initialPinchDistance / distance;
        const newZ = initialCameraZ * scale;
        
        // Ogranicz zoom (min 3, max 20)
        cameraRef.current.position.z = Math.max(3, Math.min(20, newZ));
      } else if (e.touches.length === 1) {
        handleMouseMove(e);
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) { // If fewer than two fingers remain after lifting one
        initialPinchDistance = null;
        initialCameraZ = null;
      }
      if (e.touches.length === 0) { // If all fingers are lifted
        handleMouseUp();
      }
    };

    // Zoom kółkiem myszy na desktopie
    const handleWheel = (e) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      
      const delta = e.deltaY * 0.01;
      const newZ = cameraRef.current.position.z + delta;
      cameraRef.current.position.z = Math.max(3, Math.min(20, newZ));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', handleTouchEnd);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    createKeychain();
    // Usunięto całkowicie dynamiczne dostosowanie kamery
  }, [config.shape, config.size, config.width, config.height, config.color, config.hasBorder, config.borderColor, config.graphicUrl, config.showGraphic, config.graphicScale, config.productionMethod, config.backText, config.hookPosition, config.hasNFC]);

  function createKeychainMaterial() {
    const color = new THREE.Color(config.color);
    const hasResin = config.productionMethod === 'laser' || config.productionMethod === '3d-resin';
    
    if (hasResin) {
      // Materiał żywiczny - gładki, błyszczący
      return new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });
    } else {
      // Materiał PLA - matowy z lekką teksturą druku 3D
      const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.0,
        roughness: 0.7,
        side: THREE.DoubleSide,
      });
      
      // Dodaj subtelną teksturę druku 3D
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Tło w kolorze materiału
      ctx.fillStyle = config.color;
      ctx.fillRect(0, 0, 512, 512);
      
      // Subtelne linie druku 3D
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 512; i += 3) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      
      material.map = texture;
      material.needsUpdate = true;
      
      return material;
    }
  }

  function createChain(startY, endY) { 
    const chainGroup = new THREE.Group();
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xB8B8B8,
      metalness: 0.95,
      roughness: 0.15,
    });

    const linkCount = 9;
    const linkRadius = 0.1;
    const linkSpacing = linkRadius * 1.2;

    for (let i = 0; i < linkCount; i++) {
      const linkGeometry = new THREE.TorusGeometry(linkRadius, 0.025, 12, 24);
      const link = new THREE.Mesh(linkGeometry, metalMaterial);
      
      // Co drugie ogniwo obracamy o 90 stopni wokół Y
      if (i % 2 === 1) {
        link.rotation.y = Math.PI / 2;
      }
      
      // Pozycja - od góry w dół ze stałym odstępem
      link.position.y = startY - (i * linkSpacing);
      link.castShadow = true;
      link.receiveShadow = true;
      chainGroup.add(link);
    }

    return chainGroup;
  }

  function createKeyRing() {
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xB8B8B8,
      metalness: 0.95,
      roughness: 0.15,
    });

    // Duże kółko 2cm średnicy = promień 1cm = 0.4 jednostki w 3D
    const ringGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
    const ring = new THREE.Mesh(ringGeometry, metalMaterial);
    ring.castShadow = true;
    ring.receiveShadow = true;

    return ring;
  }

  function createKeychain() {
    const scene = sceneRef.current;
    if (!scene) return;

    // Zapisz obecny obrót przed usunięciem
    let savedRotation = null;
    if (keychainRef.current) {
      savedRotation = {
        x: keychainRef.current.rotation.x,
        y: keychainRef.current.rotation.y,
        z: keychainRef.current.rotation.z
      };
      scene.remove(keychainRef.current);
    }

    const keychainGroup = new THREE.Group();
    
    // Przywróć zapisany obrót
    if (savedRotation) {
      keychainGroup.rotation.x = savedRotation.x;
      keychainGroup.rotation.y = savedRotation.y;
      keychainGroup.rotation.z = savedRotation.z;
    }
    
    keychainRef.current = keychainGroup;

    // Realistyczna skala
    const scaleFactorCmTo3D = 0.4;
    const size = config.shape === 'rectangle' 
      ? { width: config.width * scaleFactorCmTo3D, height: config.height * scaleFactorCmTo3D } 
      : { width: config.size * scaleFactorCmTo3D, height: config.size * scaleFactorCmTo3D };
    
    const tagHeight = config.shape === 'rectangle' ? size.height : size.width;
    
    // ZAWIESZKA - ZAWSZE NA ŚRODKU (X=0, Y=3.0)
    const keyRingRadius = 0.4;
    const keyRingY = 3.0;
    
    // Łańcuszek startuje od kółka
    const chainStartY = keyRingY - keyRingRadius - 0.05;
    
    // Dostosowana długość łańcuszka dla sześciokąta i ośmiokąta
    let chainLength = 1.0;
    if (config.shape === 'hexagon' || config.shape === 'octagon') {
      chainLength = 0.88;
    }
    
    const chainEndY = chainStartY - chainLength;
    
    // BRELOK - NA ŚRODKU w X, rośnie W DÓŁ
    const tagY = chainEndY - 0.02 - tagHeight / 2;

    // 1. Duże kółko - STAŁE NA ŚRODKU (X=0, Y=3.0)
    const keyRing = createKeyRing();
    keyRing.position.set(0, keyRingY, 0);
    keychainGroup.add(keyRing);

    // 2. Łańcuszek - ZAWSZE NA ŚRODKU (X=0)
    const chain = createChain(chainStartY, chainEndY);
    chain.position.x = 0; // ZAWSZE ŚRODEK - NIE RUSZA SIĘ
    keychainGroup.add(chain);

    // 3. Brelok - NA ŚRODKU, ale rotacja sprawia że punkt zaczepu jest przesunięty
    const keychainTag = createTag();
    keychainTag.position.set(0, tagY, 0); // Brelok zawsze na środku
    
    // Rotacje - dla diamentu BRAK rotacji (zawsze 0), dla innych normalne
    let rotation = 0;
    if (config.shape !== 'diamond') {
      const hookRotations = {
        'top-center': 0,
        'top-left': -Math.PI / 8,
        'top-right': Math.PI / 8,
        'side-left': -Math.PI / 6,
        'side-right': Math.PI / 6
      };
      rotation = hookRotations[config.hookPosition] || 0;
    }
    
    keychainTag.rotation.z = rotation;
    
    keychainGroup.add(keychainTag);

    scene.add(keychainGroup);
  }

  function createTag() {
    const tagGroup = new THREE.Group();
    const material = createKeychainMaterial();

    let geometry;
    const scaleFactorCmTo3D = 0.4;
    const size = config.shape === 'rectangle' ? 
      { width: config.width * scaleFactorCmTo3D, height: config.height * scaleFactorCmTo3D } : 
      { width: config.size * scaleFactorCmTo3D, height: config.size * scaleFactorCmTo3D };

    switch (config.shape) {
      case 'circle':
        geometry = new THREE.CylinderGeometry(size.width / 2, size.width / 2, 0.3, 32);
        break;
      case 'square':
        geometry = new THREE.BoxGeometry(size.width, 0.3, size.width);
        break;
      case 'rectangle':
        geometry = new THREE.BoxGeometry(size.width, 0.3, size.height);
        break;
      case 'hexagon':
        const hexShape = new THREE.Shape();
        const hexRadius = size.width / 2;
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = hexRadius * Math.cos(angle);
          const y = hexRadius * Math.sin(angle);
          if (i === 0) hexShape.moveTo(x, y);
          else hexShape.lineTo(x, y);
        }
        hexShape.closePath();
        geometry = new THREE.ExtrudeGeometry(hexShape, {
          depth: 0.3,
          bevelEnabled: false
        });
        geometry.rotateX(-Math.PI / 2);
        geometry.center();
        break;
      case 'octagon':
        const octShape = new THREE.Shape();
        const octRadius = size.width / 2;
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI / 4) * i;
          const x = octRadius * Math.cos(angle);
          const y = octRadius * Math.sin(angle);
          if (i === 0) octShape.moveTo(x, y);
          else octShape.lineTo(x, y);
        }
        octShape.closePath();
        geometry = new THREE.ExtrudeGeometry(octShape, {
          depth: 0.3,
          bevelEnabled: false
        });
        geometry.rotateX(-Math.PI / 2);
        geometry.center();
        break;
      case 'diamond':
        const diamondShape = new THREE.Shape();
        const dSize = size.width / 2;
        diamondShape.moveTo(0, dSize);
        diamondShape.lineTo(dSize, 0);
        diamondShape.lineTo(0, -dSize);
        diamondShape.lineTo(-dSize, 0);
        diamondShape.closePath();
        geometry = new THREE.ExtrudeGeometry(diamondShape, {
          depth: 0.3,
          bevelEnabled: false
        });
        geometry.rotateX(-Math.PI / 2);
        geometry.center();
        break;
      default:
        geometry = new THREE.BoxGeometry(size.width, 0.3, size.height);
    }

    const tag = new THREE.Mesh(geometry, material);
    tag.castShadow = true;
    tag.receiveShadow = true;
    tag.rotation.x = Math.PI / 2; // Orient flat along XY plane of tagGroup, thickness along Z axis of tagGroup
    tagGroup.add(tag);

    // Border - obramówka TYLKO Z PRZODU (3D wypustka WEWNĄTRZ breloka)
    const borderHeight = 0.06;
    
    if (config.hasBorder) {
      const borderMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.borderColor),
        metalness: 0.0,
        roughness: 0.6,
      });
      
      // The tag's front face is at Z = 0.15 (half of 0.3 thickness).
      // borderZ will be the center of the border's thickness.
      const borderZ = 0.15 + borderHeight / 2;

      if (config.shape === 'circle') {
        const borderWidth = 0.075; // Thinner border
        const outerRadius = size.width / 2;
        const innerRadius = size.width / 2 - borderWidth;
        
        const ringShape = new THREE.Shape();
        // Outer path (clockwise)
        for (let i = 0; i <= 32; i++) {
          const angle = (i / 32) * Math.PI * 2;
          const x = Math.cos(angle) * outerRadius;
          const y = Math.sin(angle) * outerRadius;
          if (i === 0) ringShape.moveTo(x, y);
          else ringShape.lineTo(x, y);
        }
        // Inner path (counter-clockwise to define a hole)
        const holePath = new THREE.Path();
        for (let i = 32; i >= 0; i--) { // Iterate backwards
          const angle = (i / 32) * Math.PI * 2;
          const x = Math.cos(angle) * innerRadius;
          const y = Math.sin(angle) * innerRadius;
          if (i === 32) holePath.moveTo(x, y);
          else holePath.lineTo(x, y);
        }
        ringShape.holes.push(holePath);
        
        const ringGeometry = new THREE.ExtrudeGeometry(ringShape, {
          depth: borderHeight, // Extrudes along local Z-axis
          bevelEnabled: false
        });
        // Center the extrusion along its local Z-axis, so position.z works as intended
        ringGeometry.translate(0, 0, -borderHeight / 2); 
        
        const ringBorder = new THREE.Mesh(ringGeometry, borderMaterial);
        ringBorder.position.z = borderZ; // Position the centered border along tagGroup's Z-axis
        ringBorder.castShadow = true;
        tagGroup.add(ringBorder);
        
      } else if (config.shape === 'square' || config.shape === 'rectangle') {
        const w = size.width; // Tag's width along X in tagGroup
        const h = config.shape === 'rectangle' ? size.height : size.width; // Tag's height along Y in tagGroup
        const borderWidth = 0.06; // Thinner border width for the frame strips

        // Top bar
        const topGeometry = new THREE.BoxGeometry(w, borderWidth, borderHeight); // width (X), height (Y), depth (Z)
        const topBorder = new THREE.Mesh(topGeometry, borderMaterial);
        topBorder.position.set(0, h / 2 - borderWidth / 2, borderZ); // x, y, z
        topBorder.castShadow = true;
        tagGroup.add(topBorder);
        
        // Bottom bar
        const bottomBorder = topBorder.clone();
        bottomBorder.position.set(0, -h / 2 + borderWidth / 2, borderZ);
        bottomBorder.castShadow = true;
        tagGroup.add(bottomBorder);
        
        // Left bar
        const leftGeometry = new THREE.BoxGeometry(borderWidth, h - 2 * borderWidth, borderHeight); // width (X), height (Y), depth (Z)
        const leftBorder = new THREE.Mesh(leftGeometry, borderMaterial);
        leftBorder.position.set(-w / 2 + borderWidth / 2, 0, borderZ);
        leftBorder.castShadow = true;
        tagGroup.add(leftBorder);
        
        // Right bar
        const rightBorder = leftBorder.clone();
        rightBorder.position.set(w / 2 - borderWidth / 2, 0, borderZ);
        rightBorder.castShadow = true;
        tagGroup.add(rightBorder);
        
      } else if (config.shape === 'hexagon') {
        // Hexagonal border
        const borderWidth = 0.075;
        const hexRadius = size.width / 2;
        
        const outerShape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = hexRadius * Math.cos(angle);
          const y = hexRadius * Math.sin(angle);
          if (i === 0) outerShape.moveTo(x, y);
          else outerShape.lineTo(x, y);
        }
        outerShape.closePath();
        
        const innerPath = new THREE.Path();
        const innerRadius = hexRadius - borderWidth;
        for (let i = 5; i >= 0; i--) { // Iterate backwards for hole
          const angle = (Math.PI / 3) * i;
          const x = innerRadius * Math.cos(angle);
          const y = innerRadius * Math.sin(angle);
          if (i === 5) innerPath.moveTo(x, y);
          else innerPath.lineTo(x, y);
        }
        innerPath.closePath();
        outerShape.holes.push(innerPath);
        
        const hexBorderGeom = new THREE.ExtrudeGeometry(outerShape, {
          depth: borderHeight,
          bevelEnabled: false
        });
        hexBorderGeom.translate(0, 0, -borderHeight / 2); // Center along its Z-axis
        
        const hexBorder = new THREE.Mesh(hexBorderGeom, borderMaterial);
        hexBorder.position.z = borderZ;
        hexBorder.castShadow = true;
        tagGroup.add(hexBorder);
        
      } else if (config.shape === 'octagon') {
        // Ośmiokątna obramówka
        const borderWidth = 0.075;
        const octRadius = size.width / 2;
        
        const outerShape = new THREE.Shape();
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI / 4) * i;
          const x = octRadius * Math.cos(angle);
          const y = octRadius * Math.sin(angle);
          if (i === 0) outerShape.moveTo(x, y);
          else outerShape.lineTo(x, y);
        }
        outerShape.closePath();
        
        const innerPath = new THREE.Path();
        const innerRadius = octRadius - borderWidth;
        for (let i = 7; i >= 0; i--) {
          const angle = (Math.PI / 4) * i;
          const x = innerRadius * Math.cos(angle);
          const y = innerRadius * Math.sin(angle);
          if (i === 7) innerPath.moveTo(x, y);
          else innerPath.lineTo(x, y);
        }
        innerPath.closePath();
        outerShape.holes.push(innerPath);
        
        const octBorderGeom = new THREE.ExtrudeGeometry(outerShape, {
          depth: borderHeight,
          bevelEnabled: false
        });
        octBorderGeom.translate(0, 0, -borderHeight / 2);
        const octBorder = new THREE.Mesh(octBorderGeom, borderMaterial);
        octBorder.position.z = borderZ;
        octBorder.castShadow = true;
        tagGroup.add(octBorder);
        
      } else if (config.shape === 'diamond') {
        // Diamentowa obramówka
        const borderWidth = 0.075;
        const dSize = size.width / 2;
        
        const outerShape = new THREE.Shape();
        outerShape.moveTo(0, dSize);
        outerShape.lineTo(dSize, 0);
        outerShape.lineTo(0, -dSize);
        outerShape.lineTo(-dSize, 0);
        outerShape.closePath();
        
        const innerPath = new THREE.Path();
        const innerSize = dSize - borderWidth;
        innerPath.moveTo(0, innerSize);
        innerPath.lineTo(innerSize, 0);
        innerPath.lineTo(0, -innerSize);
        innerPath.lineTo(-innerSize, 0);
        innerPath.closePath();
        outerShape.holes.push(innerPath);
        
        const diamondBorderGeom = new THREE.ExtrudeGeometry(outerShape, {
          depth: borderHeight,
          bevelEnabled: false
        });
        diamondBorderGeom.translate(0, 0, -borderHeight / 2);
        
        // Materiał z obustronnym renderowaniem
        const diamondBorderMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(config.borderColor),
          metalness: 0.0,
          roughness: 0.6,
          side: THREE.DoubleSide // Renderuj obie strony
        });
        
        const diamondBorder = new THREE.Mesh(diamondBorderGeom, diamondBorderMaterial);
        diamondBorder.position.z = borderZ;
        diamondBorder.castShadow = true;
        tagGroup.add(diamondBorder);
      }
    }

    // Logo/graphic - NA PRZODZIE BRELOKA z przycinaniem do kształtu
    if (config.showGraphic && config.graphicUrl) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(config.graphicUrl, (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        const logoScale = config.graphicScale / 100;
        
        // Maksymalne wymiary logo zależne od kształtu
        let maxLogoWidth, maxLogoHeight;
        
        if (config.shape === 'circle') {
          maxLogoWidth = maxLogoHeight = size.width * 0.6;
        } else if (config.shape === 'diamond') {
          maxLogoWidth = maxLogoHeight = size.width * 0.5;
        } else if (config.shape === 'hexagon' || config.shape === 'octagon') {
          maxLogoWidth = maxLogoHeight = size.width * 0.55;
        } else {
          maxLogoWidth = size.width * 0.7;
          maxLogoHeight = (config.shape === 'rectangle' ? size.height : size.width) * 0.7;
        }
        
        let logoWidth = maxLogoWidth * logoScale;
        let logoHeight = logoWidth / aspectRatio;

        if (logoHeight > maxLogoHeight) {
          logoHeight = maxLogoHeight * logoScale;
          logoWidth = logoHeight * aspectRatio;
        }

        // Tworzenie geometrii logo z maską kształtu breloka
        let logoGeometry;
        
        if (config.shape === 'circle') {
          const circleShape = new THREE.Shape();
          const radius = Math.min(logoWidth, logoHeight) / 2;
          circleShape.absarc(0, 0, radius, 0, Math.PI * 2, false);
          logoGeometry = new THREE.ShapeGeometry(circleShape);
        } else if (config.shape === 'diamond') {
          const diamondShape = new THREE.Shape();
          const dSize = Math.min(logoWidth, logoHeight) / 2;
          diamondShape.moveTo(0, dSize);
          diamondShape.lineTo(dSize, 0);
          diamondShape.lineTo(0, -dSize);
          diamondShape.lineTo(-dSize, 0);
          diamondShape.closePath();
          logoGeometry = new THREE.ShapeGeometry(diamondShape);
        } else if (config.shape === 'hexagon') {
          const hexShape = new THREE.Shape();
          const hexRadius = Math.min(logoWidth, logoHeight) / 2;
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = hexRadius * Math.cos(angle);
            const y = hexRadius * Math.sin(angle);
            if (i === 0) hexShape.moveTo(x, y);
            else hexShape.lineTo(x, y);
          }
          hexShape.closePath();
          logoGeometry = new THREE.ShapeGeometry(hexShape);
        } else if (config.shape === 'octagon') {
          const octShape = new THREE.Shape();
          const octRadius = Math.min(logoWidth, logoHeight) / 2;
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i;
            const x = octRadius * Math.cos(angle);
            const y = octRadius * Math.sin(angle);
            if (i === 0) octShape.moveTo(x, y);
            else octShape.lineTo(x, y);
          }
          octShape.closePath();
          logoGeometry = new THREE.ShapeGeometry(octShape);
        } else {
          logoGeometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
        }

        const logoMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.1
        });

        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        const frontOffset = 0.15 + (config.hasBorder ? borderHeight : 0) + 0.01;
        logoMesh.position.z = frontOffset; 
        tagGroup.add(logoMesh);
      });
    }

    // NFC Icon + Text na plecy - PRZYCINANE DO KSZTAŁTU
    if (config.hasNFC) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f13a16b00b764d7126f6b2/5608efebc_Screenshot_20251027_003943_Google.png', (texture) => {
        // Maksymalny rozmiar NFC w zależności od kształtu
        let maxNFCSize;
        if (config.shape === 'circle') {
          maxNFCSize = size.width * 0.5;
        } else if (config.shape === 'diamond') {
          maxNFCSize = size.width * 0.4;
        } else if (config.shape === 'hexagon' || config.shape === 'octagon') {
          maxNFCSize = size.width * 0.45;
        } else {
          maxNFCSize = Math.min(size.width, config.shape === 'rectangle' ? size.height : size.width) * 0.5;
        }
        
        const nfcMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          alphaTest: 0.1
        });
        
        const nfcGeometry = new THREE.PlaneGeometry(maxNFCSize, maxNFCSize);
        const nfcMesh = new THREE.Mesh(nfcGeometry, nfcMaterial);
        
        // Pozycja NFC - na środku tyłu
        nfcMesh.position.set(0, 0, -0.16);
        nfcMesh.rotation.y = Math.PI;
        nfcMesh.castShadow = true;
        nfcMesh.receiveShadow = true;
        tagGroup.add(nfcMesh);
      });
    }

    return tagGroup;
  }

  const hasResin = config.productionMethod === 'laser' || config.productionMethod === '3d-resin';

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Drag instruction */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-[10px] font-bold text-gray-700 flex items-center gap-1.5 z-10 border border-gray-200">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0110 9.87v4.263a1 1 0 011.555.832l3.197-2.132a1 1 0 010-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 18 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Przeciągnij aby obrócić
      </div>

      {/* Size indicator - LEWY DOLNY RÓG */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] text-gray-800 font-bold shadow-lg border border-gray-200">
          {config.shape === 'rectangle' 
            ? `${config.width}cm × ${config.height}cm`
            : `${config.size}cm`}
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => toggleBadge('method')}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-2 py-1 rounded-lg text-white font-bold shadow-lg transition-all"
        >
          {expandedBadge === 'method' ? (
            <span className="text-[9px] whitespace-nowrap">
              {config.productionMethod === '3d' && '🖨️ Druk 3D'}
              {config.productionMethod === 'laser' && '✨ Laser + Żywica'}
              {config.productionMethod === '3d-resin' && '💎 3D + Żywica'}
            </span>
          ) : (
            <span className="text-sm">
              {config.productionMethod === '3d' && '🖨️'}
              {config.productionMethod === 'laser' && '✨'}
              {config.productionMethod === '3d-resin' && '💎'}
            </span>
          )}
        </button>
        {hasResin && (
          <button
            onClick={() => toggleBadge('glass')}
            className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 px-2 py-1 rounded-lg text-gray-900 font-black shadow-lg transition-all"
          >
            {expandedBadge === 'glass' ? (
              <span className="text-[9px] whitespace-nowrap">✨ Efekt Szkła</span>
            ) : (
              <span className="text-sm">✨</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
