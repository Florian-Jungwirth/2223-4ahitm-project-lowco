import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { createNoise2D } from 'simplex-noise';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  BoxGeometry,
  CylinderGeometry,
  Mesh,
  MeshPhysicalMaterial,
  PCFShadowMap,
  SphereGeometry,
  Vector2,
} from 'three';
import TWEEN, { Tween } from '@tweenjs/tween.js';
import SunCalc from 'suncalc';
import { Observable } from 'rxjs';
import { TitleService } from 'src/app/services/title.service';
import { SurveyService } from 'src/app/services/survey.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isOpen() {
    if (
      this.surveys.nativeElement./*parentElement.*/ classList.contains('transe')
    ) {
      this.setHeight(window.innerHeight - this.height, true);
      this.surveys.nativeElement.style.height = this.height + 'px';
    } else {
      this.setHeight(window.innerHeight);
      this.surveys.nativeElement.style.height = 0 + 'px';
    }
    this.surveys.nativeElement./*parentElement.*/ classList.toggle('transe');
    // this.surveys.nativeElement.parentElement.classList.toggle('notTranse');
  }

  @ViewChild('canvas') container!: ElementRef;
  @ViewChild('surveys') surveys!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  camera: THREE.PerspectiveCamera;
  scene = new THREE.Scene();
  water: Water;
  controls: OrbitControls;
  envmap: THREE.Texture;
  sun = new THREE.Vector3();
  sunColor = 0xffffff;
  waterColor = '#259e9a';
  previousTheta: any;
  previousPhi: any;
  quickSelection: any[];
  values: any;
  time = new Date();
  types: any;
  ISLANDSIZE = 15;
  directionalLight: THREE.DirectionalLight;
  latitude = 48.27965;
  longitude = 14.2533;
  sky: Sky;
  height = 0;
  // trashObjects: THREE.Mesh[] = [];
  raycaster = new THREE.Raycaster();
  meshTweens: { [key: string]: Tween<any> } = {};
  // intersects: THREE.Intersection[];
  // directionalLightHelper: THREE.DirectionalLightHelper

  constructor(
    private surveyService: SurveyService,
    private titleService: TitleService
  ) {
    window.navigator.geolocation.watchPosition((position: GeolocationPosition) => {
      this.longitude = position.coords.longitude;
      this.latitude = position.coords.latitude;    
    });
  }

  ionViewWillEnter() {
    this.titleService.setTitle('LowCo2');
    Promise.all([
      this.getAllVaues(),
      this.surveyService.getTypes(),
      this.surveyService.getAmountOfSurveys(4),
      this.surveyService.getQuicks(),
      this.surveyService.getAllActivatedSurveys(),
    ]).then(([values, types, quickSelection, quicks, surveys]) => {
      if (quicks.length == 0) {
        this.quickSelection = quickSelection;
      } else {
        let qs = [];

        for (const survey of surveys) {
          for (const quick of quicks) {
            if (survey._id == quick) {
              qs.push(survey);
              break;
            }
          }
        }

        this.quickSelection = qs;
      }
      this.values = values;
      this.types = types;

      switch (this.quickSelection.length) {
        case 1:
          this.quickSelection[0].style = 'grid-column: 1/3';
          break;
        case 2:
          this.quickSelection[0].style = 'grid-column: 1/3';
          this.quickSelection[1].style = 'grid-column: 1/3';
          break;
        case 3:
          this.quickSelection[0].style = 'grid-column: 1/2';
          this.quickSelection[1].style = 'grid-column: 2/3';
          this.quickSelection[2].style = 'grid-column: 1/3';
          break;
        case 4:
          this.quickSelection[0].style = 'grid-column: 1/2';
          this.quickSelection[1].style = 'grid-column: 2/3';
          this.quickSelection[2].style = 'grid-column: 1/2';
          this.quickSelection[3].style = 'grid-column: 2/3';
          break;
      }

      setTimeout(() => {
        this.height = this.surveys.nativeElement.offsetHeight;
        this.surveys.nativeElement.style.height = this.height + 'px';
        this.setHeight(window.innerHeight - this.height, true);
      }, 200);
    });
  }

  ngAfterViewInit() {
    this.init();
    this.generateMap();
    this.animate();

    window.addEventListener('resize', () => {
      if (
        !this.surveys.nativeElement.parentElement.classList.contains('transe')
      ) {
        this.setHeight(
          window.innerHeight - this.menu.nativeElement.offsetHeight,
          true
        );
      } else {
        this.setHeight(window.innerHeight);
      }
    });

    // this.changeWaterColor(
    //   '#' + this.water.material.uniforms['waterColor'].value.getHexString()
    // );
  }

  init() {
    const self = this;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.container.nativeElement.appendChild(this.renderer.domElement);

    //camera

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    this.camera.position.set(30, 30, 100);

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        'assets/textures/waternormals.jpg',
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: this.sunColor,
      waterColor: this.waterColor,
      distortionScale: 8,
      fog: this.scene.fog !== undefined,
    });
    this.water.rotation.x = -Math.PI / 2;

    this.scene.add(this.water);
    this.water.position.set(0, 2, 0);

    // const parameters = {
    //   elevation: 2,
    //   azimuth: 180,
    // };

    // const ambientLight = new THREE.AmbientLight(this.sunColor, 0.3);
    // this.scene.add(ambientLight);

    function addCloud() {
      let geo = new SphereGeometry(0, 0, 0);
      let count = 1;
      for (let i = 0; i < count; i++) {
        let puffArray: SphereGeometry[] = [];

        let particleCount = Math.floor(Math.random() * 200 + 20);
        let width = 5;
        let height = 3;
        let length = 8;
        for (let j = 0; j < particleCount; j++) {
          let smallPuff = new SphereGeometry((Math.random() * 2 + 3) / 5, 7, 7);
          let lengthR = Math.random() * length;
          let heightR = Math.random() * height;
          let widthR = Math.random() * width;

          smallPuff.translate(
            Math.random() * lengthR,
            Math.random() * heightR,
            Math.random() * widthR
          );

          puffArray.push(smallPuff);
        }

        const cloudGeo = mergeGeometries(puffArray);
        cloudGeo.translate(
          Math.random() * 5,
          Math.random() * 10 + 11,
          Math.random() * 5
        );
        cloudGeo.rotateY(Math.random() * Math.PI * 2);
        geo = mergeGeometries([geo, cloudGeo]) as SphereGeometry;
      }

      const mesh = new Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          flatShading: true,
          opacity: 0.5,
          transparent: true,
        })
        //new MeshBasicMaterial()
      );

      self.scene.add(mesh);
    }

    addCloud();
    addCloud();

    // Skybox

    this.sky = new Sky();
    this.sky.scale.setScalar(10000);
    this.scene.add(this.sky);

    const skyUniforms = this.sky.material.uniforms;

    // skyUniforms['turbidity'].value = 10;
    // skyUniforms['rayleigh'].value = 0.4;
    // skyUniforms['mieCoefficient'].value = 0.009;
    // skyUniforms['mieDirectionalG'].value = 0.95;

    skyUniforms['turbidity'].value = 11;
    skyUniforms['rayleigh'].value = 0.1;
    skyUniforms['mieCoefficient'].value = 0.000009;
    skyUniforms['mieDirectionalG'].value = 0.9;

    this.directionalLight = new THREE.DirectionalLight(this.sunColor, 0.1);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = this.ISLANDSIZE * 10;
    this.directionalLight.shadow.mapSize.width = 128;
    this.directionalLight.shadow.mapSize.height = 128;
    this.directionalLight.shadow.camera.left = -this.ISLANDSIZE * 2;
    this.directionalLight.shadow.camera.right = this.ISLANDSIZE * 2;
    this.directionalLight.shadow.camera.top = this.ISLANDSIZE * 2;
    this.directionalLight.shadow.camera.bottom = -this.ISLANDSIZE * 2;
    this.scene.add(this.directionalLight);
    // this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight)
    // this.scene.add(this.directionalLightHelper)
    // let cameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera)
    // this.scene.add(cameraHelper)

    const ambientLight = new THREE.AmbientLight(this.sunColor, 0.4);
    this.scene.add(ambientLight);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    let renderTarget: THREE.WebGLRenderTarget;

    function updateSun() {
      const date = self.time;
      // const date = new Date('October 13, 2014 08:13:00');
      const latitude = self.latitude;
      const longitude = self.longitude;
      const sunPosition = SunCalc.getPosition(date, latitude, longitude);

      const phi = THREE.MathUtils.degToRad(
        90 - sunPosition.altitude * (180 / Math.PI)
      );
      const theta = THREE.MathUtils.degToRad(
        sunPosition.azimuth * (180 / Math.PI)
      );

      self.previousPhi = phi;
      self.previousTheta = theta;

      // Calculate the current time as a decimal value between 0 and 24
      const hours =
        date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
      const eveningStart = 18; // Start dimming the light at 6 PM
      const eveningEnd = 21; // Stop dimming the light at 9 PM
      let intensity = 1; // Default intensity is 1 (fully bright)

      // If it's evening, reduce the intensity of the light
      if (hours >= eveningStart && hours <= eveningEnd) {
        const t = (hours - eveningStart) / (eveningEnd - eveningStart); // Interpolate the intensity between 1 and 0
        intensity = THREE.MathUtils.lerp(1, 0.2, t);
      }

      self.directionalLight.intensity = intensity;

      self.sun.setFromSphericalCoords(0.5, phi, theta);

      self.directionalLight.position.set(
        self.sun.x * self.ISLANDSIZE * 10,
        self.sun.y * self.ISLANDSIZE * 10,
        self.sun.z * self.ISLANDSIZE * 10
      );
      // self.directionalLight.position.set(20, 20, 20);

      self.sky.material.uniforms['sunPosition'].value.copy(self.sun);
      self.sky.name = 'sky';
      self.water.material.uniforms['sunDirection'].value
        .copy(self.sun)
        .normalize();

      if (renderTarget !== undefined) renderTarget.dispose();

      renderTarget = pmremGenerator.fromScene(self.scene);

      // self.scene.environment = renderTarget.texture;
      // self.envmap = renderTarget.texture;
    }

    updateSun();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 40.0;
    this.controls.maxDistance = 200.0;
    this.controls.update();
    // this.scene.fog = new THREE.FogExp2( 0xefd1b5, 0.006 );
  }

  render() {
    this.water.material.uniforms['time'].value += 1.0 / 120.0;
    this.renderer.render(this.scene, this.camera);
    TWEEN.update();
    // this.directionalLightHelper.update()
  }

  setHeight(heightTo: number, zoomIn = false) {
    let duration = 420;
    let oldHeight = {
      height: this.renderer.getSize(new THREE.Vector2()).height,
    };
    let zoom = { zoom: this.camera.zoom };

    // https://sbcode.net/threejs/tween/ (Eases)

    // Create a new tween
    new TWEEN.Tween(oldHeight)
      .to({ height: heightTo }, duration)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onUpdate(() => {
        // Update the renderer size, camera aspect ratio, and projection matrix
        this.renderer.setSize(window.innerWidth, oldHeight.height);
        this.camera.aspect = window.innerWidth / oldHeight.height;
        this.renderer.render(this.scene, this.camera);
        this.camera.updateProjectionMatrix();
      })
      .start();

    if (zoomIn) {
      new TWEEN.Tween(zoom)
        .to({ zoom: 1.5 }, duration)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(() => {
          this.camera.zoom = zoom.zoom;
        })
        .start();
    } else {
      new TWEEN.Tween(zoom)
        .to({ zoom: 1.4 }, duration)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(() => {
          this.camera.zoom = zoom.zoom;
        })
        .start();
    }

    // this.renderer.setSize(window.innerWidth, heightTo);
    // this.camera.aspect = window.innerWidth / heightTo;
    // this.camera.updateProjectionMatrix();
  }

  changeWaterColor(targetColor = '#053c00', duration = 2000) {
    let start = this.water.material.uniforms['waterColor'].value;
    new TWEEN.Tween(start)
      .to(new THREE.Color(targetColor), duration)
      .onUpdate(() => {
        this.water.material.uniforms['waterColor'].value.set(start);
      })
      .start();
  }

  changeTime(targetDate: Date, duration = 8000) {
    const latitude = this.latitude;
    const longitude = this.longitude;
    const sunPosition = SunCalc.getPosition(targetDate, latitude, longitude);

    const phi = THREE.MathUtils.degToRad(
      90 - sunPosition.altitude * (180 / Math.PI)
    );

    const theta = THREE.MathUtils.degToRad(
      sunPosition.azimuth * (180 / Math.PI)
    );

    const hours =
      targetDate.getHours() +
      targetDate.getMinutes() / 60 +
      targetDate.getSeconds() / 3600;
    const eveningStart = 18;
    const eveningEnd = 21;
    let intensity: any = 1;

    if (hours >= eveningStart && hours <= eveningEnd) {
      const t = (hours - eveningStart) / (eveningEnd - eveningStart);
      intensity = THREE.MathUtils.lerp(1, 0.2, t);
    }
    intensity = 0.1;

    // this.directionalLight.intensity = intensity;

    // this.sun.setFromSphericalCoords(0.5, phi, theta);

    let previousIntens = { intens: this.directionalLight.intensity };
    let toIntens = { intens: intensity };

    new TWEEN.Tween(previousIntens)
      .to(toIntens, duration)
      .onUpdate(() => {
        this.directionalLight.intensity = previousIntens.intens;
      })
      .start();

    let phiAndTheta = { phi: this.previousPhi, theta: this.previousTheta };

    new TWEEN.Tween(phiAndTheta)
      .to({ phi: phi, theta: theta }, duration)
      .onUpdate(() => {
        this.sun.setFromSphericalCoords(
          0.5,
          phiAndTheta.phi,
          phiAndTheta.theta
        );
        this.water.material.uniforms['sunDirection'].value
          .copy(this.sun)
          .normalize();
        this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
      })
      .start();

    this.previousTheta = theta;
    this.previousPhi = phi;
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // renderer.setAnimationLoop(() => {
    //   controls.update();
    //   renderer.render(scene, camera);
    //   water.material.uniforms['time'].value += 1.0 / 1000.0;
    //   lightHolder.quaternion.copy(camera.quaternion);
    // });

    this.render();
  };

  generateMap() {
    const MAX_HEIGHT = 10;
    const STONE_HEIGHT = MAX_HEIGHT * 0.8;
    const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
    const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
    const SAND_HEIGHT = MAX_HEIGHT * 0.3;
    const DIRT2_HEIGHT = MAX_HEIGHT * 0;

    let stoneGeo = new BoxGeometry(0, 0, 0);
    let dirtGeo = new BoxGeometry(0, 0, 0);
    let dirt2Geo = new BoxGeometry(0, 0, 0);
    let sandGeo = new BoxGeometry(0, 0, 0);
    let grassGeo = new BoxGeometry(0, 0, 0);

    (async () => {
      const threshold = 0.2;
      const gamma = 1;
      // let noi
      const noise2D = createNoise2D();
      for (let i = -this.ISLANDSIZE; i <= this.ISLANDSIZE; i++) {
        for (let j = -this.ISLANDSIZE; j <= this.ISLANDSIZE; j++) {
          let position = tileToPosition(i, j);

          if (position.length() > this.ISLANDSIZE) continue;

          let noise = (noise2D(i * 0.1, j * 0.1) + 1) * 0.5;

          noise = Math.pow(noise, gamma);
          if (noise < threshold) noise = 0;

          makeHex(noise * MAX_HEIGHT, position);
        }
      }

      // console.log(noi);

      // let textures = {
      //   stone: await new THREE.TextureLoader().loadAsync('../../../assets/textures/stone.jpg'),
      // };

      let stoneMesh = hexMesh(stoneGeo, 'rgb(168, 168, 168)'); //rgb(r,g,b)
      // let stoneMesh = hexMeshTex(stoneGeo, textures.stone);
      let grassMesh = hexMesh(grassGeo, 'rgb(86, 209, 79)');
      let dirtMesh = hexMesh(dirtGeo, 'rgb(161, 109, 72)');
      let dirt2Mesh = hexMesh(dirt2Geo, 'rgb(135, 90, 47)');
      let sandMesh = hexMesh(sandGeo, 'rgb(255, 234, 166)');

      const mapGroup = new THREE.Group();
      mapGroup.name = 'map';
      // this.directionalLight.target.position.set(mapGroup.position.x, mapGroup.position.y, mapGroup.position.z)

      mapGroup.add(stoneMesh, grassMesh, dirtMesh, dirt2Mesh, sandMesh);
      this.scene.add(mapGroup);

      // let mapFloor = new Mesh(
      //   new CylinderGeometry(37, 37, MAX_HEIGHT * 0.1, 50),
      //   new MeshPhysicalMaterial({
      //     envMap: self.envmap,
      //     color: new Color(0xa16d48),
      //     envMapIntensity: 0.1,
      //     side: DoubleSide,
      //   })
      //   //new MeshBasicMaterial({color: 0xa16d48})
      // );
      // mapFloor.receiveShadow = true;
      // mapFloor.position.set(0, -MAX_HEIGHT * 0.05, 0);
      // self.scene.add(mapFloor);

      // let mapContainer = new Mesh(
      //   new CylinderGeometry(34.2, 34.2, MAX_HEIGHT * 0.25, 50, 1, true),
      //   new MeshPhysicalMaterial({
      //     // envMap: envmap,
      //     color: new Color(0xa16d48),
      //     envMapIntensity: 0.2,
      //     side: DoubleSide,
      //   })
      //   //new MeshBasicMaterial( {color: 0xa16d48, side: DoubleSide} )
      // );
      // mapContainer.receiveShadow = true;
      // mapContainer.position.set(0, MAX_HEIGHT * 0.125, 0);
      // self.scene.add(mapContainer);
    })();

    function hexGeometry(height: number, position: { x: number; y: number }) {
      let geo = new CylinderGeometry(1, 1, height, 6, 1, false);
      geo.translate(position.x, height * 0.5, position.y);

      return geo;
    }

    function tileToPosition(tileX: number, tileY: number) {
      return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
    }

    function makeHex(height: number, position: THREE.Vector2) {
      let geo = hexGeometry(height, position);
      if (height > STONE_HEIGHT) {
        stoneGeo = mergeGeometries([geo, stoneGeo]) as BoxGeometry;

        if (Math.random() > 0.8) {
          stoneGeo = mergeGeometries([stoneGeo, stone(height, position)]) as BoxGeometry;
        }
      } else if (height > DIRT_HEIGHT) {
        dirtGeo = mergeGeometries([geo, dirtGeo]) as BoxGeometry;
      } else if (height > GRASS_HEIGHT) {
        grassGeo = mergeGeometries([geo, grassGeo]) as BoxGeometry;

        if (Math.random() > 0.8) {
          grassGeo = mergeGeometries([grassGeo, tree(height, position)]) as BoxGeometry;
        }
      } else if (height > SAND_HEIGHT) {
        sandGeo = mergeGeometries([geo, sandGeo]) as BoxGeometry;

        if (Math.random() > 0.8 && stoneGeo) {
          stoneGeo = mergeGeometries([stoneGeo, stone(height, position)]) as BoxGeometry;
        }
      } else if (height > DIRT2_HEIGHT) {
        dirt2Geo = mergeGeometries([geo, dirt2Geo]) as BoxGeometry;
      }
    }

    function stone(height: number, position: THREE.Vector2) {
      const px = Math.random() * 0.4;
      const pz = Math.random() * 0.4;

      const geo = new SphereGeometry(Math.random() * 0.3 + 0.1, 10, 10);
      geo.translate(position.x + px, height, position.y + pz);
      return geo;
    }

    function hexMesh(geo: any, color: any) {
      let mat = new MeshPhysicalMaterial({
        // envMap: self.envmap,
        color: color,
        // blending: THREE.NormalBlending,
        flatShading: true,
      });

      //let mat = new MeshBasicMaterial({color: color})

      let mesh = new Mesh(geo, mat);

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    function hexMeshTex(geo: any, map: any) {
      let mat = new MeshPhysicalMaterial({
        // envMap: self.envmap,
        map: map,
        // blending: THREE.NormalBlending,
        flatShading: true,
      });

      //let mat = new MeshBasicMaterial({color: color})

      let mesh = new Mesh(geo, mat);

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    function tree(height: number, position: THREE.Vector2) {
      const treeHeight = Math.random() * 1 + 1.25;
      let rotation = Math.random();

      const geo = new CylinderGeometry(0, 1.5, treeHeight, 3);
      geo.rotateY(rotation);
      geo.translate(position.x, height + treeHeight * 0 + 1, position.y);

      const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3);
      geo2.rotateY(rotation);
      geo2.translate(position.x, height + treeHeight * 0.6 + 1, position.y);

      const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3);
      geo3.rotateY(rotation);
      geo3.translate(position.x, height + treeHeight * 1.25 + 1, position.y);

      return mergeGeometries([geo, geo2, geo3]);
    }

    // this.glbLoader('trash_models/bag.glb').then((glbScene) => {
    //   let bag = glbScene.scene;

    //   bag.scale.set(0.05, 0.05, 0.05);
    //   bag.position.set(0, 0.8, 20);
    //   this.scene.add(bag);

    //   let yVec = {y: 0.8}

    //   let tween = new TWEEN.Tween(yVec)
    //     .to({ y: 1 }, 1000)
    //     .easing(TWEEN.Easing.Sinusoidal.In)
    //     .onUpdate(() => {
    //       console.log(yVec);
          
    //       bag.position.set(bag.position.x, yVec.y, bag.position.z);
    //     })
    //     .repeat(Infinity)
    //     .yoyo(true)
    //     .start();

    //     bag.uuid = THREE.MathUtils.generateUUID();

    //     this.meshTweens[bag.uuid] = tween;

    //     console.log(this.meshTweens);
        

    //     bag.traverse((child) => {
    //       if ((child as THREE.Mesh).isMesh) {
    //         const childObj = child as THREE.Mesh;
    //         this.trashObjects.push(childObj);
    //       }
    //     });
    // });

    document.addEventListener('click', (event: MouseEvent) => {
      let mouse = new THREE.Vector2(
        (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
      );
      this.raycaster.setFromCamera(mouse, this.camera);
      // this.intersects = this.raycaster.intersectObjects(
      //   this.trashObjects,
      //   true
      // );
      // if (this.intersects.length > 0) {
      //   console.log(this.intersects[0].object);
      //   this.meshTweens[this.intersects[0].object.uuid].stop();
      //   delete this.meshTweens[this.intersects[0].object.uuid];

      //   this.intersects[0].object.visible = false;
      // }
    });
  }

  async glbLoader(pathInAssets: string) {
    let loader = new GLTFLoader();
    return await loader.loadAsync('../../../assets/' + pathInAssets);
  }

  getValueById(survey: any) {
    for (const value of this.values) {
      if (survey._id == value.survey._id) {
        return value.value;
      }
    }
    return survey.standardValue;
  }

  getUnitById(survey: any) {
    for (const value of this.values) {
      if (survey._id == value.survey._id) {
        return value.unit;
      }
    }
    return null;
  }

  async getAllVaues(): Promise<any> {
    return await this.surveyService.getAllValuesByUser();
  }

  waterChange() {
    this.changeWaterColor(this.waterColor);
  }

  timeChange() {
    console.log('ad');

    this.changeTime(new Date('2017-06-01T' + this.time));
  }
}
