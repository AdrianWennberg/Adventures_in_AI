
	
	let WorldRadius = 200;
	let WorldSize = 500;
	let BlockRadius = 67;
    let train = false;
	
	var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;
	
	let Entity1;
	let Entity2;
	
		function setup(){
			createCanvas(WorldSize,WorldSize);
			Entity1 = new Entity(0, 0);
			Entity2 = new Entity(180, 1);
			Entity1.setOther(Entity2);
			Entity2.setOther(Entity1);
		}
		
		function draw(){
		
			background(110);
		
			translate(WorldSize/2,WorldSize/2);
			noFill();
			ellipse(0,0,WorldRadius*2);
            if(train) fill(0, 255, 0);
            else fill(255, 0, 0);
			ellipse(0,0,BlockRadius*2);
			
			Entity1.update();
			Entity2.update();
			
			<!-- if(IsInProximityRadiuns(Entity1,Entity2, 2*Math.acos(BlockRadius/WorldRadius))){ -->
				<!-- Entity2.move(1); -->
			<!-- } -->
			
			Entity1.show();
			Entity2.show();
			
			line(Entity1.getx(),Entity1.gety(),Entity2.getx(),Entity2.gety());
			
		}
        
        function mousePressed()
        {
            train = !train;
        }
		
		function toRadiuns(angle){
			return angle*Math.PI/180;
		}
		
		function toDegrees(rad){
			return rad * 180 / Math.PI;
		}
		
		function IsInProximityRadiuns(Entity1,Entity2,trigerDis){
			let diff = Math.abs(Entity1.angle - Entity2.angle);
			if(diff <= trigerDis || toRadiuns(360) - diff <= trigerDis){
				return true;
			}
			return false;
				console.log("debug");
		}
		
		class Entity{
			
			constructor(startingAngle, type){
				this.angle = toRadiuns(startingAngle);
				this.speed = 1;
				this.brain = new Brain(type);
			}
			
			setOther(other)
			{
				this.other = other;
			}
			
			
			show(){
				fill(0);
				ellipse(this.getx(),this.gety(),30)
			}
			
			getx(){
				return cos(this.angle)*WorldRadius;
			}
			
			gety(){
				return sin(this.angle)*WorldRadius
			}
			
			update()
			{
				if(this.brain.type == 0)
					this.move(random() > 0.1? 1 : 0);
				else
				{
					let choice = this.brain.network.activate([toRadiuns((360 + Math.floor(toDegrees(this.other.angle - this.angle))) % 360)/ (2.0 * Math.PI) ]);
                    console.log(choice);
					this.move(Math.round(choice));
					
					let dir = 0;
					if(Math.abs(this.other.angle - this.angle) < toRadiuns(180))
					{
						if(this.other.angle < this.angle)
						{
							dir = 1;
						}
					}
					else if(this.angle < toRadiuns(180))
					{
						dir = 1;
					}
					
					
					if(train && Math.round(choice) != dir)
                        this.brain.network.propagate(0.001, [dir]);
				}			
				
				
			}
			
			move(Direction){
				if(Direction == 1)this.angle += toRadiuns(this.speed);
				if(Direction == 0)this.angle -= toRadiuns(this.speed);
				
				if(this.angle < 0) this.angle += toRadiuns(360);
				if(this.angle >= toRadiuns(360)) this.angle -= toRadiuns(360);
			}
		
		}
		class Brain {
		
			constructor(type){
				
				this.type = type;
				
				switch(type){
					case 1: // smart
						// create the layers
						this.inputLayer = new Layer(1);
						this.outputLayer = new Layer(1);

						// connect the layers
						this.inputLayer.project(this.outputLayer);

						// set the layers
						this.network = new Network({
							input: this.inputLayer,
							output: this.outputLayer
						});
					case 0: // stupid
						
					break;
					default:
					console.log("Error, invalid brain type");
					break;
				}
			}
		
		}