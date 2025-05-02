
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import * as THREE from 'three';

interface ModelViewerProps {
  reconstructionData?: any;
  fractureData?: any;
  isLoading?: boolean;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  reconstructionData, 
  fractureData, 
  isLoading = false 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f7ff);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a placeholder 3D model
    if (!reconstructionData) {
      let mesh;
      if (isLoading) {
        // Simple cube as loading indicator
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x0c8ee7,
          opacity: 0.7,
          transparent: true
        });
        mesh = new THREE.Mesh(geometry, material);
      } else {
        // Bone-like shape as placeholder
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0xe0e0e0,
          specular: 0x111111,
          shininess: 100
        });
        mesh = new THREE.Mesh(geometry, material);
        
        // Add bone ends
        const topSphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const topSphereMesh = new THREE.Mesh(topSphereGeometry, material);
        topSphereMesh.position.y = 1.5;
        mesh.add(topSphereMesh);
        
        const bottomSphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const bottomSphereMesh = new THREE.Mesh(bottomSphereGeometry, material);
        bottomSphereMesh.position.y = -1.5;
        mesh.add(bottomSphereMesh);
        
        // Add sample fracture highlight
        if (fractureData) {
          const fractureGeometry = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
          const fractureMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
          const fractureMesh = new THREE.Mesh(fractureGeometry, fractureMaterial);
          fractureMesh.rotation.x = Math.PI / 2;
          fractureMesh.position.y = 0.5;
          mesh.add(fractureMesh);
        }
      }
      
      scene.add(mesh);
      
      // Animation for loading state
      if (isLoading) {
        const animate = () => {
          if (mesh && mountRef.current) {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
            renderer.render(scene, camera);
            return requestAnimationFrame(animate);
          }
        };
        animate();
      } else {
        // Non-loading animation for demo
        const animate = () => {
          if (mesh && mountRef.current) {
            mesh.rotation.y += 0.003;
            renderer.render(scene, camera);
            return requestAnimationFrame(animate);
          }
        };
        animate();
      }
    } else {
      // In a real app, we would load and render the actual 3D bone reconstruction here
      // using the reconstructionData and fractureData
      renderer.render(scene, camera);
    }

    // Handle window resize
    const handleResize = () => {
      if (mountRef.current && rendererRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        rendererRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [reconstructionData, fractureData, isLoading]);

  return (
    <Card className="overflow-hidden shadow-md p-0 w-full h-full">
      <div className="mesh-container" ref={mountRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-medical-700 font-medium">
              Reconstructing 3D model...
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ModelViewer;
