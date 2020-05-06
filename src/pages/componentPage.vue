<template>
    <div id="container">
    </div>
</template>

<script>
    import * as Three from 'three'
    import Stats from 'three/examples/jsm/libs/stats.module.js'
    import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
    import ure01 from  '@/assets/textures/circuit_pattern.png'
    import ure02 from  '@/assets/textures/grasslight-big.jpg'
    export default {
        name: "componentPage",
        data() {
            return {
                clothFunction:null,
                cloth:null,
                camera: null,
                scene: null,
                renderer: null,
                mesh: null,
                clothGeometry:null,
                object:null,
                sphere:null,
                stats:null,
                params:{
                    enableWind: true,
                    showBall: false
                },
                windForce:new Three.Vector3( 0, 0, 0 ),
                tmpForce:new Three.Vector3(),
                ballPosition:new Three.Vector3( 0, - 45, 0 ),
                diff:new Three.Vector3()
            }
        },
        methods: {
            preparation:function(){

                const restDistance = 25;
                const xSegs =10;
                const ySegs  = 10;
                const MASS = 0.1;

                function plane( width, height ) {
                    return function ( u, v, target ) {
                        let x = ( u - 0.5 ) * width;
                        let y = ( v + 0.5 ) * height;
                        let z = 0;
                        target.set( x, y, z );
                    }
                }

                function Particle( x, y, z, mass ) {

                    this.position = new Three.Vector3();
                    this.previous = new Three.Vector3();
                    this.original = new Three.Vector3();
                    this.a = new Three.Vector3( 0, 0, 0 ); // acceleration
                    this.mass = mass;
                    this.invMass = 1 / mass;
                    this.tmp = new Three.Vector3();
                    this.tmp2 = new Three.Vector3();

                    // init

                    plane( x, y, this.position ); // position
                    plane( x, y, this.previous ); // previous
                    plane( x, y, this.original );

                }

                //Force -> Acceleration 力->加速度
                Particle.prototype.addForce = function ( force ) {
                    this.a.add(
                        this.tmp2.copy( force ).multiplyScalar( this.invMass )
                    );

                };

                // Performs Verlet integration 执行加载集成
                Particle.prototype.integrate = function ( timesq ) {
                    let newPos = this.tmp.subVectors( this.position, this.previous );
                    newPos.multiplyScalar( 1-0.03 ).add( this.position );
                    newPos.add( this.a.multiplyScalar( timesq ) );
                    this.tmp = this.previous;
                    this.previous = this.position;
                    this.position = newPos;
                    this.a.set( 0, 0, 0 );
                };

                function Cloth( w, h ) {
                    w = w || 10;
                    h = h || 10;
                    this.w = w;
                    this.h = h;
                    let particles = [];
                    let constraints = [];
                    let u, v;
                    // Create particles
                    for ( v = 0; v <= h; v ++ ) {
                        for ( u = 0; u <= w; u ++ ) {
                            particles.push(
                                new Particle( u / w, v / h, 0, MASS )
                            )
                        }
                    }
                    // Structural
                    for ( v = 0; v < h; v ++ ) {
                        for ( u = 0; u < w; u ++ ) {
                            constraints.push( [
                                particles[ index( u, v ) ],
                                particles[ index( u, v + 1 ) ],
                                restDistance
                            ] )
                            constraints.push( [
                                particles[ index( u, v ) ],
                                particles[ index( u + 1, v ) ],
                                restDistance
                            ] )
                        }
                    }
                    for ( u = w, v = 0; v < h; v ++ ) {
                        constraints.push( [
                            particles[ index( u, v ) ],
                            particles[ index( u, v + 1 ) ],
                            restDistance
                        ] )
                    }
                    for ( v = h, u = 0; u < w; u ++ ) {
                        constraints.push( [
                            particles[ index( u, v ) ],
                            particles[ index( u + 1, v ) ],
                            restDistance
                        ] );
                    }
                    this.particles = particles;
                    this.constraints = constraints;
                    function index( u, v ) {
                        return u + v * ( w + 1 );
                    }
                    this.index = index;
                }

                this.clothFunction = plane( restDistance * xSegs, restDistance * ySegs );
                this.cloth = new Cloth( xSegs, ySegs );

                this.init();
                this.animate();

            },
            init: function() {

                const ballSize = 60;

                let container = document.getElementById('container');

                //scene 场景
                this.scene = new Three.Scene();
                this.scene.background = new Three.Color(0xcce0ff);
                this.scene.fog = new Three.Fog(0xcce0ff, 500, 10000 );

                //camera 照相机
                this.camera = new Three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
                this.camera.position.set(1000, 50, 1500 );

                //lights 光源
                this.scene.add(new Three.AmbientLight(0x666666));
                let light = new Three.DirectionalLight(0xdfebff, 1 );
                light.position.set( 50, 200, 100 );
                light.position.multiplyScalar( 1.3 );
                light.castShadow = true;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                const d = 300;
                light.shadow.camera.left = - d;
                light.shadow.camera.right = d;
                light.shadow.camera.top = d;
                light.shadow.camera.bottom = - d;
                light.shadow.camera.far = 1000;
                this.scene.add(light);

                //cloth material 布料
                let loader = new Three.TextureLoader();
                let clothTexture = loader.load(ure01);
                clothTexture.anisotropy = 16;
                let clothMaterial = new Three.MeshLambertMaterial({
                    map: clothTexture,
                    side: Three.DoubleSide,
                    alphaTest: 0.5
                })

                //cloth geometry 布料几何
                this.clothGeometry = new Three.ParametricBufferGeometry(this.clothFunction,this.cloth.w,this.cloth.h);

                //cloth mesh 衣料网孔
                this.object = new Three.Mesh(this.clothGeometry,clothMaterial);
                this.object.position.set( 0, 0, 0 );
                this.object.castShadow = true;
                this.scene.add( this.object );

                this.object.customDepthMaterial = new Three.MeshDepthMaterial({
                    depthPacking: Three.RGBADepthPacking,
                    map: clothTexture,
                    alphaTest: 0.5
                })

                //sphere 球体
                let ballGeo = new Three.SphereBufferGeometry(ballSize,32, 16);
                let ballMaterial = new Three.MeshLambertMaterial();

                this.sphere = new Three.Mesh( ballGeo, ballMaterial );
                this.sphere.castShadow = true;
                this.sphere.receiveShadow = true;
                this.sphere.visible = false;
                this.scene.add( this.sphere );

                //ground 地面
                let groundTexture = loader.load(ure02)
                groundTexture.wrapS = groundTexture.wrapT = Three.RepeatWrapping;
                groundTexture.repeat.set( 25, 25 );
                groundTexture.anisotropy = 16;
                groundTexture.encoding = Three.sRGBEncoding;

                let groundMaterial = new Three.MeshLambertMaterial( { map: groundTexture } );
                let mesh = new Three.Mesh( new Three.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
                mesh.position.y = - 250;
                mesh.rotation.x = - Math.PI / 2;
                mesh.receiveShadow = true;
                this.scene.add( mesh );

                //poles 杆子
                let poleGeo = new Three.BoxBufferGeometry( 5, 375, 5 );
                let poleMat = new Three.MeshLambertMaterial();

                let mesh1 = new Three.Mesh( poleGeo, poleMat );
                mesh1.position.x = - 125;
                mesh1.position.y = - 62;
                mesh1.receiveShadow = true;
                mesh1.castShadow = true;
                this.scene.add( mesh1 );

                let mesh2 = new Three.Mesh( poleGeo, poleMat );
                mesh2.position.x = 125;
                mesh2.position.y = - 62;
                mesh2.receiveShadow = true;
                mesh2.castShadow = true;
                this.scene.add( mesh2 );

                let mesh3 = new Three.Mesh( new Three.BoxBufferGeometry( 255, 5, 5 ), poleMat );
                mesh3.position.y = - 250 + ( 750 / 2 );
                mesh3.position.x = 0;
                mesh3.receiveShadow = true;
                mesh3.castShadow = true;
                this.scene.add( mesh3 );

                let gg = new Three.BoxBufferGeometry( 10, 10, 10 );
                let mesh4 = new Three.Mesh( gg, poleMat );
                mesh4.position.y = - 250;
                mesh4.position.x = 125;
                mesh4.receiveShadow = true;
                mesh4.castShadow = true;
                this.scene.add( mesh4 );

                let mesh5 = new Three.Mesh( gg, poleMat );
                mesh5.position.y = - 250;
                mesh5.position.x = - 125;
                mesh5.receiveShadow = true;
                mesh5.castShadow = true;
                this.scene.add( mesh5 );

                //renderer 渲染器
                this.renderer = new Three.WebGLRenderer( { antialias: true } );
                this.renderer.setPixelRatio( window.devicePixelRatio );
                this.renderer.setSize( window.innerWidth, window.innerHeight );

                container.appendChild( this.renderer.domElement );

                this.renderer.outputEncoding = Three.sRGBEncoding;

                this.renderer.shadowMap.enabled = true;

                //controls 控制
                let controls = new OrbitControls( this.camera, this.renderer.domElement );
                controls.maxPolarAngle = Math.PI * 0.5;
                controls.minDistance = 1000;
                controls.maxDistance = 5000;

                // performance monitor 性能监视器
                this.stats = new Stats();
                container.appendChild( this.stats.dom );

                //GUI 图形用户界面
                let gui = new GUI();
                gui.add( this.params, 'enableWind' );
                gui.add( this.params, 'showBall' );

            },
            animate: function() {
                requestAnimationFrame(this.animate);
                let time = Date.now();
                let windStrength = Math.cos( time / 7000 ) * 20 + 40;

                this.windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) );
                this.windForce.normalize();
                this.windForce.multiplyScalar( windStrength );


                this.simulate( time );
                this.render();
                this.stats.update();
            },
            simulate:function (time ) {
                let lastTime = null;
                if(! lastTime){
                    lastTime = time;
                    return;
                }
                let i = null;
                let j = null;
                let il = null;
                let particles = null;
                let particle = null;
                let constraints = null;
                let constraint = null;

                const GRAVITY = 981 * 1.4;
                const gravity = new Three.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( 0.1 );
                const TIMESTEP_SQ = 18 / 1000 * 18 / 1000;

                // Aerodynamics forces 空气动力

                if(this.params.enableWind){
                    let indx =null;
                    let normal = new Three.Vector3();
                    let indices = this.clothGeometry.index;
                    let normals = this.clothGeometry.attributes.normal;

                    particles = this.cloth.particles;

                    for (i = 0, il = indices.count; i < il; i += 3 ){
                        for (j = 0; j < 3; j ++ ){
                            indx = indices.getX( i + j );
                            normal.fromBufferAttribute( normals, indx );
                            this.tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( this.windForce ) );
                            particles[ indx ].addForce( this.tmpForce );
                        }
                    }
                }

                for (particles  = this.cloth.particles,i = 0,il = particles.length;i<il;i++){
                    particle = particles[i];
                    particle.addForce( gravity );
                    particle.integrate( TIMESTEP_SQ );
                }

                function satisfyConstraints( p1, p2, distance ) {
                    this.diff.subVectors( p2.position, p1.position );
                    let currentDist = this.diff.length();
                    if ( currentDist === 0 ) return; // prevents division by 0
                    let correction = this.diff.multiplyScalar( 1 - distance / currentDist );
                    let correctionHalf = correction.multiplyScalar( 0.5 );
                    p1.position.add( correctionHalf );
                    p2.position.sub( correctionHalf );

                }

                // Start Constraints 开始约束
                constraints = this.cloth.constraints;
                il = constraints.length;

                for ( i = 0; i < il; i ++){
                    constraint = constraints[ i ];
                    satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );
                }

                // Ball Constraints 球约束
                this.ballPosition.z =  - Math.sin( Date.now() / 600 ) * 90; //+ 40;
                this.ballPosition.x = Math.cos( Date.now() / 400 ) * 70;

                if(this.params.showBall){
                    this.sphere.visible = true;
                    for (particles = this.cloth.particles, i = 0, il = particles.length; i < il; i ++ ){
                        particle = particles[ i ];
                        let pos = particle.position;
                        this.diff.subVectors( pos,this.ballPosition );
                        if ( this.diff.length() < 60 ) {
                            // collided 碰撞
                            this.diff.normalize().multiplyScalar( 60 );
                            pos.copy( this.ballPosition ).add( this.diff );
                        }

                    }
                }else{
                    this.sphere.visible = false;
                }

                // Floor Constraints 地面约束
                for (particles = this.cloth.particles, i = 0, il = particles.length; i < il; i ++ ){
                    particle = particles[ i ];
                    let pos = particle.position;
                    if ( pos.y < - 250 ) {
                        pos.y = - 250;
                    }
                }

                let pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

                //Pin Constraints 网速响应约束
                for (i = 0, il = pins.length; i < il; i ++ ){
                    let xy = pins[ i ];
                    let p = particles[ xy ];
                    p.position.copy( p.original );
                    p.previous.copy( p.original );
                }


            },
            render:function () {
                let p = this.cloth.particles;
                for ( let i = 0, il = p.length; i < il; i ++ ) {
                    let v = p[ i ].position;
                    this.clothGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );
                }
                this.clothGeometry.attributes.position.needsUpdate = true;

                this.clothGeometry.computeVertexNormals();

                this.sphere.position.copy( this.ballPosition );

                this.renderer.render( this.scene, this.camera );

            }
        },
        mounted() {
            this.preparation();
        }
    }
</script>

<style scoped>
    #container {
        height: 35.5rem;
    }
</style>