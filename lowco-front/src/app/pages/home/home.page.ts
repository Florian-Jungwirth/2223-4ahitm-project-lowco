import {Component, ElementRef, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils';
import {createNoise2D} from 'simplex-noise';
import {Water} from 'three/examples/jsm/objects/Water';
import {Sky} from 'three/examples/jsm/objects/Sky';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import {
  BackSide,
  BoxGeometry,
  CylinderGeometry, FogExp2,
  Mesh,
  MeshPhysicalMaterial,
  PCFShadowMap,
  SphereGeometry,
  Vector2,
} from 'three';
import TWEEN, {Tween} from '@tweenjs/tween.js';
import SunCalc from 'suncalc';
import {TitleService} from 'src/app/services/title.service';
import {SurveyService} from 'src/app/services/survey.service';
import {JoinedUserSurveyModel} from "../../models/userSurvey.model";
import {Types} from "../../constants";
import {degToRad} from 'three/src/math/MathUtils';
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isOpen() {
    if (
      this.surveys.nativeElement.classList.contains('transe')
    ) {
      this.setHeight(window.innerHeight - this.height, true);
      this.surveys.nativeElement.style.height = this.height + 'px';
    } else {
      this.setHeight(window.innerHeight);
      this.surveys.nativeElement.style.height = 0 + 'px';
    }
    this.surveys.nativeElement.classList.toggle('transe');
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
  previousTheta: any;
  previousPhi: any;
  quickSelection: JoinedUserSurveyModel[];
  values: any;
  time = new Date();
  types = Types;
  ISLANDSIZE = 15;
  directionalLight: THREE.DirectionalLight;
  latitude = 48.27965;
  longitude = 14.2533;
  sky: Sky;
  progress = 0
  height = 0;
  trashObjects: THREE.Mesh[] = [];
  raycaster = new THREE.Raycaster();
  meshTweens: Map<string, Tween<any>> = new Map();
  timeCategory: number | null = null
  meshes = {
    stoneMesh: new THREE.Mesh<any, THREE.MeshPhysicalMaterial, THREE.Object3DEventMap>,
    dirt2Mesh: new THREE.Mesh<any, THREE.MeshPhysicalMaterial, THREE.Object3DEventMap>,
    sandMesh: new THREE.Mesh<any, THREE.MeshPhysicalMaterial, THREE.Object3DEventMap>,
    grassMesh: new THREE.Mesh<any, THREE.MeshPhysicalMaterial, THREE.Object3DEventMap>,
    dirtMesh: new THREE.Mesh<any, THREE.MeshPhysicalMaterial, THREE.Object3DEventMap>
  }

  cloudColor = new THREE.Color(0xffffff); // dark #565656 / light #ffffff
  cloudMaterial: THREE.MeshStandardMaterial
  waterColor = new THREE.Color(0x259e9a); // #259e9a normal Water / #053c00 green Water / #3f2a14 brown Water

  constructor(
    private surveyService: SurveyService,
    private titleService: TitleService,
    private categoryService: CategoryService
  ) {
    window.navigator.geolocation.watchPosition((position: GeolocationPosition) => {
      this.longitude = position.coords.longitude;
      this.latitude = position.coords.latitude;
    });
    this.surveyService.userPointsEmitter.subscribe((data) => {
      this.setColorsPerPercentage(data)
      console.log(data)
    })
    this.surveyService.getPointsOfUser()
  }

  ionViewWillEnter() {
    this.quickSelection = []
    this.titleService.setTitle('LowCo2');
    this.surveyService.activeQuicksHomeEmitter.subscribe((quicks: JoinedUserSurveyModel[]) => {

      this.quickSelection = quicks;
      this.surveys.nativeElement.style.height = '0px'

      if (this.quickSelection.length % 2 != 0) {
        this.surveys.nativeElement.classList.add('odd')
      } else {
        this.surveys.nativeElement.classList.remove('odd')
      }

      this.surveys.nativeElement.style.height = 'fit-content'

      this.types = Types;

      setTimeout(() => {
        this.height = this.surveys.nativeElement.offsetHeight;
        this.surveys.nativeElement.style.height = this.height + 'px';
        this.setHeight(window.innerHeight - this.height, true);
      }, 200);
    })
    this.surveyService.getActiveQuicksHome()
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

  }

  async ngOnInit() {
    this.timeCategory = await this.categoryService.getHours()
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
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }
      ),
      sunDirection: new THREE.Vector3(10000,10000,10000),
      sunColor: this.sunColor,
      waterColor: this.waterColor,
      distortionScale: 5,
      alpha: 0.9,
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

    this.cloudMaterial = new THREE.MeshStandardMaterial({
      flatShading: true,
      opacity: 0.65,
      color: self.cloudColor,
      transparent: true,
    })

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

      let cloudMesh = new Mesh(
        geo,
        self.cloudMaterial
      );

      self.scene.add(cloudMesh);
    }

    addCloud();
    addCloud();
    addCloud();

    // Skybox
    this.sky = new Sky();

    this.scene.add(this.sky);

    this.sky.scale.setScalar(10000);
    let shader: any = Sky.SkyShader

    const skyUniforms = this.sky.material.uniforms;
    skyUniforms['turbidity'].value = 11;
    skyUniforms['rayleigh'].value = 0.1;
    skyUniforms['mieCoefficient'].value = 0.000009; //0.09
    skyUniforms['mieDirectionalG'].value = 0.9; //0.9

    this.sky.material = new THREE.ShaderMaterial({
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      uniforms: skyUniforms,
      side: BackSide
    })


    // skyUniforms['turbidity'].value = 10;
    // skyUniforms['rayleigh'].value = 0.4;
    // skyUniforms['mieCoefficient'].value = 0.009;
    // skyUniforms['mieDirectionalG'].value = 0.95;


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
    this.controls.maxPolarAngle = Math.PI * 0.52;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 30.0;
    this.controls.maxDistance = 200.0;
    this.controls.update();
  }

  render() {
    this.water.material.uniforms['time'].value += 1.0 / 160.0;
    this.renderer.render(this.scene, this.camera);
    TWEEN.update();
    // this.directionalLightHelper.update()
  }

  setHeight(heightTo: number, zoomIn = false) {
    let duration = 420;
    let oldHeight = {
      height: this.renderer.getSize(new THREE.Vector2()).height,
    };
    let zoom = {zoom: this.camera.zoom};

    // https://sbcode.net/threejs/tween/ (Eases)

    // Create a new tween
    new TWEEN.Tween(oldHeight)
      .to({height: heightTo}, duration)
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
        .to({zoom: 1.5}, duration)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(() => {
          this.camera.zoom = zoom.zoom;
        })
        .start();
    } else {
      new TWEEN.Tween(zoom)
        .to({zoom: 1.4}, duration)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(() => {
          this.camera.zoom = zoom.zoom;
        })
        .start();
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  };

  generateMap() {
    const MAX_HEIGHT = 10;
    const STONE_HEIGHT = MAX_HEIGHT * 0.8;
    const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
    const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
    const SAND_HEIGHT = MAX_HEIGHT * 0.3;
    const DIRT2_HEIGHT = MAX_HEIGHT * 0.1;

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

      this.meshes.stoneMesh = hexMesh(stoneGeo, new THREE.Color(0xa8a8a8)); //rgb(168, 168, 168)
      this.meshes.grassMesh = hexMesh(grassGeo, new THREE.Color(0x56d14f)); //rgb(86, 209, 79) normal green
      this.meshes.dirtMesh = hexMesh(dirtGeo, new THREE.Color(0xa16d48));      //rgb(161, 109, 72)
      this.meshes.dirt2Mesh = hexMesh(dirt2Geo, new THREE.Color(0x875a2f)); //rgb(135, 90, 47)
      this.meshes.sandMesh = hexMesh(sandGeo, new THREE.Color(0xffeaa6));      //rgb(255, 234, 166)

      let mapGroup = new THREE.Group();
      mapGroup.name = 'map';

      mapGroup.add(this.meshes.stoneMesh, this.meshes.grassMesh, this.meshes.dirtMesh, this.meshes.dirt2Mesh, this.meshes.sandMesh);
      this.scene.add(mapGroup)
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
        color: color,
        flatShading: true,
      });

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

    this.glbLoader('trash_models/bag.glb').then((glbScene) => {
      let bagGroup = glbScene.scene;

      bagGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const bag = child as THREE.Mesh;
          this.trashObjects.push(bag);

          bag.scale.set(0.05, 0.05, 0.05);
          bag.rotation.x = -1.5
          bag.position.set(30, 0.8, 10);
          this.scene.add(bag);

          let yVec = {y: 0.8}

          let tween = new TWEEN.Tween(yVec)
            .to({y: 1}, 800 + Math.random() * 1000)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .onUpdate(() => {
              bag.position.set(bag.position.x, yVec.y, bag.position.z);
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

          let changeVec = new THREE.Vector2(bag.position.x, bag.position.z)
          let tween2 = new TWEEN.Tween(changeVec)
            .to(new THREE.Vector2(0, 0), 10000)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .onUpdate(() => {
              bag.position.set(changeVec.x, bag.position.y, changeVec.y);
              this.raycaster.set(bag.position, new THREE.Vector3(0, 0, -0.00001))
              let interSecting = this.raycaster.intersectObjects(this.scene.children)

              interSecting.forEach((elem) => {
                if (elem.object.parent?.name == 'map') {
                  tween2.stop()
                }
              })
            })
            .start();

          this.meshTweens.set(bag.uuid, tween);

          console.log(bag)
        }
      });
    });

    document.addEventListener('click', (event: MouseEvent) => {
      const rect = this.renderer.domElement.getBoundingClientRect();

      let mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(mouse, this.camera);
      this.raycaster.near = 0
      this.raycaster.far = 100000
      let intersectingObjects = this.raycaster.intersectObjects(this.scene.children)

      intersectingObjects.forEach((elem) => {
        this.trashObjects.forEach((trash) => {
          if (elem.object.uuid == trash.uuid) {
            this.trashObjects.splice(this.trashObjects.indexOf(trash), 1)
            this.scene.remove(trash)
            this.meshTweens.get(trash.uuid)?.stop()
            console.log("found")
            return;
          }
        })
      })
    });
  }

  async glbLoader(pathInAssets: string) {
    let loader = new GLTFLoader();
    return await loader.loadAsync('../../../assets/' + pathInAssets);
  }

  tween1: null | Tween<any> = null
  tween2: null | Tween<any> = null
  tween3: null | Tween<any> = null
  tween4: null | Tween<any> = null

  setColorsPerPercentage(percentage = 0.3) {

    if(this.tween1) {
      this.tween1.stop()
    }

    if(this.tween2) {
      this.tween2.stop()
    }


    if(this.tween3) {
      this.tween3.stop()
    }

    if(this.tween4) {
      this.tween4.stop()
    }

    let badGrass = new THREE.Color(0xb9a22d)
    let badStone = new THREE.Color(0x787d78)
    let badDirt = new THREE.Color(0x5d461a)
    let badDirt2 = new THREE.Color(0xa36e40)
    let badSand = new THREE.Color(0xffeaa6)
    let water = new THREE.Color(0xa8621d)
    let clouds = new THREE.Color(0xa1a1a1)

    let oldColors = {
      badGrass: new THREE.Color(0x56d14f),
      badStone: new THREE.Color(0xa8a8a8),
      badDirt: new THREE.Color(0xa16d48),
      badDirt2: new THREE.Color(0xa16d48),
      badSand: new THREE.Color(0xffeaa6),
      water: new THREE.Color(0x259e9a),
      clouds: new THREE.Color(0xffffff)
    }

    this.tween1 = new TWEEN.Tween(oldColors)
      .to({badGrass, badStone, badDirt, badDirt2, badSand, water, clouds}, 2000)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onUpdate((e, d) => {
        if (d >= 1-percentage) {
          if(this.tween1) {
            this.tween1.stop()
          }
        } else {
          this.meshes.grassMesh.material.color = e.badGrass
          this.meshes.stoneMesh.material.color = e.badStone
          this.meshes.dirtMesh.material.color = e.badDirt
          this.meshes.dirt2Mesh.material.color = e.badDirt2
          this.meshes.sandMesh.material.color = e.badSand
          this.water.material.uniforms['waterColor'].value.set(e.water)
          this.cloudMaterial.color = e.clouds
        }
      })
      .start();

      const geometry = new THREE.PlaneGeometry(20000, 20000);

      const material = new THREE.MeshBasicMaterial({color: 0xababab, transparent: true, opacity: 0});

      const plane = new THREE.Mesh(geometry, material);
      const plane2 = new THREE.Mesh(geometry, material);
      const plane3 = new THREE.Mesh(geometry, material);
      const plane4 = new THREE.Mesh(geometry, material);
      const plane5 = new THREE.Mesh(geometry, material);
      plane.position.set(-10000, 0, 0)
      plane2.position.set(10000, 0, 0)
      plane3.position.set(0, 0, 10000)
      plane4.position.set(0, 0, -10000)
      plane5.position.set(0, 10000, 0)

      plane.rotateY(degToRad(90))
      plane2.rotateY(degToRad(-90))
      plane3.rotateY(degToRad(180))
      plane5.rotateX(degToRad(90))



      let fog = new FogExp2(0xababab, 0)
      this.scene.fog = fog
      let start = {density: fog.density}

      this.tween2 = new TWEEN.Tween(start)
        .to({density: 0.007}, 2000)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((e, d) => {
          if (d >= 1-percentage) {
            if(this.tween2) {
              this.tween2.stop()
            }
          } else {
            fog.density = e.density
          }
        })
        .start();

      let startPlanes = {opacity: 0}

       this.tween3 = new TWEEN.Tween(startPlanes)
        .to({opacity: 0.96}, 2000)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate((e, d) => {
          if (d >= 1-percentage) {
            if(this.tween3) {
              this.tween3.stop()
            }
          } else {
            material.opacity = e.opacity
          }
        })
        .start();

    let start4 = {progress: this.progress}
    this.tween4 = new TWEEN.Tween(start4)
      .to({progress: percentage}, 2000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate((e, d) => {
        this.progress = e.progress
      })
      .start();

      this.scene.add(plane)
      this.scene.add(plane2)
      this.scene.add(plane3)
      this.scene.add(plane4)
      this.scene.add(plane5)

  }
}
