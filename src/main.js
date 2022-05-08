import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fragment from './shaders/fragment2.glsl'
import vertex from './shaders/vertex2.glsl'
import testTexturE from './assets/text2.png';
import front from '../front.png'
import back from '../back.png'







export default class Sketch{
	constructor(options){


		

		this.container = options.domElement;
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;

		this.camera = new THREE.PerspectiveCamera( 70, this.width/this.height, 0.01, 10 );
		this.camera.position.z = 3;


        this.time = 0;
		
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x151515);

		this.renderer = new THREE.WebGLRenderer( { 
      		antialias: true,
      		alpha: true
     } );
		this.renderer.setPixelRatio(1);
		this.container.appendChild(this.renderer.domElement);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		
        this.clock = new THREE.Clock();

		this.resize();
		this.addObjects();
		this.render();
		this.setupResize();
        this.addLights();
	}


    addLights(){
        this.scene.add(new THREE.AmbientLight(0xffffff,0.8))

        let dirLight = new THREE.DirectionalLight(0xffffff,3)
        dirLight.position.set(-30,-10,-10)
        this.scene.add(dirLight)

    }

	resize(){
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize( this.width, this.height);
		this.camera.aspect = this.width/this.height;
		this.camera.updateProjectionMatrix();
	}

	setupResize(){
		window.addEventListener('resize',this.resize.bind(this));
	}


	addObjects(){

    let frontTexture = new THREE.TextureLoader().load(front);
    let backTexture = new THREE.TextureLoader().load(back);

    [frontTexture,backTexture].forEach(t=>{
        t.wrapS = 1000;
        t.wrapT = 1000;
        t.repeat.set(1,1);
        t.offset.setX(0.5);
        t.flipY = false;
    })
    // backTexture.repeat.set(-1,1)


    let frontMaterial = new THREE.MeshStandardMaterial({
        map: frontTexture,
        side: THREE.BackSide,
        roughness: 0.25,
        metalness: 0.05,
        alphaTest: true,
        flatShading: false
    })


    let backtMaterial = new THREE.MeshStandardMaterial({
        map: backTexture,
        side: THREE.FrontSide,
        roughness: 0.65,
        metalness: 0.25,
        alphaTest: true,
        flatShading: true
    })


    this.geometry2 = new THREE.TorusKnotGeometry(0.5, 0.15, 768, 4, 3, 1);
    // this.geometry2 = new THREE.PlaneBufferGeometry( 3, 3, 100 ,100);
    // this.material2 = new THREE.MeshNormalMaterial();

    this.material2 = new THREE.ShaderMaterial({
		// wireframe: true,
		uniforms: {
        uTime: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        uProgress: { value: 1.0 },
        uTexture: { value: new THREE.TextureLoader().load(testTexturE)},
      },
      transparent: false,
      side: THREE.FrontSide,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.mesh2 = new THREE.Mesh( this.geometry2, this.material2 );
    this.scene.add(this.mesh2)




    this.geometry = new THREE.SphereBufferGeometry( 1, 30, 30);
    this.plane = new THREE.Mesh( this.geometry, new THREE.
        MeshBasicMaterial({color: 0x00ff00, wireframe: true}));
	
    // this.scene.add(this.plane);




    let num = 8;
    let curvePoints = []
    for (let i = 0; i < num; i++) {

        let theta = i/num * Math.PI*2;
        curvePoints.push(
            new THREE.Vector3().setFromSphericalCoords(
                1,Math.PI/2 + 0.5*(Math.random()- 0.5),theta
            )
        )
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    curve.tension = 0.7;
    curve.closed = true;

    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    const curveObject = new THREE.Line( geometry, material );

    // this.scene.add(curveObject);




    let number = 1000;

    let frenetFrames = curve.computeFrenetFrames(number, true);
    let spacedPoints = curve.getSpacedPoints(number);
    let tempPlane = new THREE.PlaneBufferGeometry(1, 1, number, 1);
    let dimensions = [-.1,0.1]

    this.materials = [frontMaterial,backtMaterial]

    
    tempPlane.addGroup(0,6000,0)
    tempPlane.addGroup(0,6000,1)
    
    console.log(frenetFrames, spacedPoints);
    let point = new THREE.Vector3();
    let binormalShift = new THREE.Vector3();
    let temp2 = new THREE.Vector3();

    let finalPoints = []

    dimensions.forEach(d=>{
        for (let i = 0; i <= number; i++) {
            point = spacedPoints[i];
            binormalShift.add(frenetFrames.binormals[i]).multiplyScalar(d);
            finalPoints.push(new THREE.Vector3().copy(point).add(binormalShift).normalize());
        }
    })


    finalPoints[0].copy(finalPoints[number])
    finalPoints[number+1].copy(finalPoints[2*number+1])

    tempPlane.setFromPoints(finalPoints)
    // console.log(finalPoints,finalPoints)





     this.finalMesh = new THREE.Mesh(
        tempPlane,
        this.materials
        );
  
    this.scene.add(this.finalMesh);
	}



	render(){

        this.material2.uniforms.uTime.value = this.clock.getElapsedTime();

        this.time += 0.002;

        this.mesh2.position.y = 0.3;
        this.finalMesh.position.y = 0.3;        
     
		this.renderer.render( this.scene, this.camera );
		requestAnimationFrame(this.render.bind(this))

        this.materials.forEach((m,i)=>{
            m.map.offset.setX(this.time)
            // if(i>0){
            //     m.map.offset.setX(-this.time)
            // }
        })
    
	}
}
 
new Sketch({
	domElement: document.getElementById('container')
});



