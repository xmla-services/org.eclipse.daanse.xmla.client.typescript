
import mqtt  from "mqtt";
import type { MqttClient} from "mqtt";
import { getCurrentInstance } from 'vue'

export default class MQTTDatasource {
  public url = null;
  public id = null as unknown as string;
  public caption = null;
  public type = "MQTT";
  public client:MqttClient;

  private _msg_parsed:any = {};
  private eventBus:any;

  constructor(id, url, caption,eventBus) {
    console.log(eventBus)
    this.id = id;
    this.url = url;
    this.caption = caption;
    this.eventBus = eventBus;



    try {
      this.client = mqtt.connect(this.url,{port:8081,username:'iwoms',password:'b2952fa553ad3ac2'});
      this.client.on("connect", () => {
        console.log('connected')
        this.client.subscribe('5g/data/test/tram/#',(err)=>{
          if(!err){
            this.client.on('message',(toptic,msg,)=>{
              console.log('message');
               this._msg_parsed = JSON.parse(msg.toString());
               console.log(this._msg_parsed);
               if(this.eventBus){
                 console.log(`UPDATE:${this.id}`);
                 this.eventBus.emit(`UPDATE:${this.id}`);
               }
            });
          }
        });
      });
    }catch (e){
      console.log(e);
    }

  }

  async getData(url) {
    return this._msg_parsed;
  }

  getState() {
    return {
      id: this.id,
      url: this.url,
      caption: this.caption,
      type: this.type,
    };
  }
}
