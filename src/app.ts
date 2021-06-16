/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import ws from 'ws';
// import { MreArgumentError } from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */



export default class HelloWorld {
	private menu: MRE.Actor = null;
	private start: MRE.Actor = null;
	private reconnect: MRE.Actor = null;
	private upB: MRE.Actor = null;
	private downB: MRE.Actor = null;
	private leftB: MRE.Actor = null;
	private rightB: MRE.Actor = null;
	private startB: MRE.Actor = null;
	private selectB: MRE.Actor = null;
	private bB: MRE.Actor = null;
	private aB: MRE.Actor = null;
	private eB: MRE.Actor = null;
	private assets: MRE.AssetContainer;
	private buzzerSound: MRE.Sound = undefined;
	private webs: ws = null;
	private webC: boolean;
	private checkWS: boolean;
	constructor(private context: MRE.Context, private params: MRE.ParameterSet) {
		this.context.onStarted(() => this.started());
	}
	private user: MRE.User;
	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
		// set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);
		this.checkWS = false;



		this.menu = MRE.Actor.Create(this.context, {});

		// makes box mesh
		const startMesh = this.assets.createBoxMesh('startB', 0.3, 0.3, 0.01);

		// spawn a copy of the glTF model
		this.start = MRE.Actor.Create(this.context, {
			actor: {
				name: 'start',
				// Parent the glTF model to the text actor, so the transform is relative to the text
				parentId: this.menu.id,
				transform: {
					local: {
						position: { x: 0, y: 0, z: 0 },
						scale: { x: 0.4, y: 0.4, z: 0.4 }
					}
				},
				appearance: { meshId: startMesh.id },
				collider: { geometry: { shape: MRE.ColliderType.Auto } },
				text: {
					contents: "Start",
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
					height: 0.3
				}
			}
		});

		this.reconnect = MRE.Actor.Create(this.context, {
			actor: {
				name: 'start',
				// Parent the glTF model to the text actor, so the transform is relative to the text
				parentId: this.menu.id,
				transform: {
					local: {
						position: { x: 0.5, y: 0, z: 0 },
						scale: { x: 0.4, y: 0.4, z: 0.4 }
					}
				},
				appearance: { meshId: startMesh.id },
				collider: { geometry: { shape: MRE.ColliderType.Auto } },
				text: {
					contents: "Reconnect",
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
					height: 0.3
				}
			}
		});
		this.buzzerSound = this.assets.createSound(
			'alarmSound',
			{ uri: 'Gameboy Startup Sound.wav' });


		// Set up cursor interaction. We add the input behavior ButtonBehavior to the button.
		// Button behaviors have two pairs of events: hover start/stop, and click start/stop.
		const startBehavior = this.start.setBehavior(MRE.ButtonBehavior);


		startBehavior.onClick(_ => {
			const options: MRE.SetAudioStateOptions = { volume: 0.2 };
			options.time = 0;
			this.start.startSound(this.buzzerSound.id, options);
			this.user = _;
			this.connect();
			this.control();
			
		});
		const recBehavior = this.reconnect.setBehavior(MRE.ButtonBehavior);


		recBehavior.onClick(_ => {
			this.connect();
		});


		// Set up cursor interaction. We add the input behavior ButtonBehavior to the button.
		// Button behaviors have two pairs of events: hover start/stop, and click start/stop.
	}
	private connect(){
		this.webs = new ws(this.params['ip'].toString());
	}
	//button generation and websocket initiation
	private async control() {
		// 192.168.1.190
		if (this.checkWS === false) {
			this.webs.on('open', function open() {
				console.log('Openned');
			});
			this.webs.on('close', function open() {
				console.log('Closed');
			});
			this.checkWS = true;


			const cubeData = await this.assets.loadGltf('directionButton.glb', "box");
			const BAData = await this.assets.loadGltf('BAButton.glb', "box");
			const ssData = await this.assets.loadGltf('SSButton.glb', "box");
			// spawn a copy of the glTF model
			this.upB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: cubeData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -1, y: -1, z: 0.1 },
							scale: { x: 0.4, y: 0.4, z: 0.4 },
							rotation: { x: 0, y: 90, z: 0 }
						}
					}
				}
			});
			const upBBehavior = this.upB.setBehavior(MRE.ButtonBehavior);

			upBBehavior.onClick(_ => {
				this.webs.send('up');
			});

			// =================================
			this.downB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: cubeData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -1, y: -1, z: -0.1 },
							scale: { x: 0.4, y: 0.4, z: 0.4 },
							rotation: { x: 0, y: 0, z: 0 }
						}
					}
				}
			});
			const downBehavior = this.downB.setBehavior(MRE.ButtonBehavior);

			downBehavior.onClick(_ => {
				this.webs.send('down');
			});

			// =================================
			this.leftB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: cubeData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -1.1, y: -1, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 },
							rotation: { x: 0, y: 1, z: 0 }
						}
					}
				}
			});
			const leftBehavior = this.leftB.setBehavior(MRE.ButtonBehavior);

			leftBehavior.onClick(_ => {
				this.webs.send('left');
			});

			// =================================
			this.rightB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: cubeData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -0.9, y: -1, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 },
							rotation: { x: 0, y: -1, z: 0 }
						}
					}
				}
			});
			const rightBehavior = this.rightB.setBehavior(MRE.ButtonBehavior);

			rightBehavior.onClick(_ => {
				this.webs.send('right');
			});

			// =================================
			this.bB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: BAData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -0.53, y: -1, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 },
							rotation: { x: 0, y: -1, z: 0 }
						}
					}
				}
			});
			const bBehavior = this.bB.setBehavior(MRE.ButtonBehavior);

			bBehavior.onClick(_ => {
				this.webs.send('B');
			});

			// =================================
			this.aB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: BAData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -0.70, y: -1, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 },
							rotation: { x: 0, y: -1, z: 0 }
						}
					}
				}
			});
			const aBehavior = this.aB.setBehavior(MRE.ButtonBehavior);

			aBehavior.onClick(_ => {
				this.webs.send('A');
			});


			// =================================
			this.startB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: ssData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -0.30, y: -1, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 },
							rotation: { x: 0, y: -1, z: 0 }
						}
					}
				}
			});
			const startBehavior = this.startB.setBehavior(MRE.ButtonBehavior);

			startBehavior.onClick(_ => {
				this.webs.send('start');
			});

			// =================================
			this.selectB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: ssData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: -0.40, y: -1, z: 0 },
							scale: { x: 0.4, y: 0.38, z: 0.4 },
							rotation: { x: 0, y: -1, z: 0 }
						}
					}
				}
			});
			const selectBehavior = this.selectB.setBehavior(MRE.ButtonBehavior);

			selectBehavior.onClick(_ => {
				this.webs.send('select');
			});
			// =================================
			this.eB = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: ssData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: 0, y: -1, z: 0 },
							scale: { x: 0.4, y: 0.38, z: 0.4 },
							rotation: { x: 0, y: -1, z: 0 }
						}
					}
				}
			});
			const eBehavior = this.eB.setBehavior(MRE.ButtonBehavior);

			eBehavior.onClick(_ => {
				this.webs.send('E');
			});
		}
	}
}
