import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-stream-stats',
  templateUrl: './stream-stats.component.html',
  styleUrls: ['./stream-stats.component.css']
})
export class StreamStatsComponent implements OnInit {
  @ViewChild(BaseChartDirective)
  public bitrateChart: BaseChartDirective;

  @Input('restream') restream: object;
  @Input('visible') visible: boolean;

  public bitrateData:Array<any>;
  public bitrateLabels:Array<any> = [];

  public bitrateChartOptions = {
    scales: {
      xAxes: [{
          time: {
            unit: 'minute'
          }
      }]
    },
    animation: {
      easing: 'linear',
      duration: 1250
    },
    responsive: true,
    maintainAspectRatio: false
  }

  /**
   * This component should poll the API service asking for
   * stats about the restream specified in the restream
   * attribute for this element.
   * 
   * This component should display the following stats:
   * - Uptime
   * - Bitrate graph
   * - Endpoint status (connected, disconnected)
   * - Restream "log" of notable events
   *   (such as: connect, disconnect, low bitrate, etc...)
   */

  constructor(private apiService:ApiService) {

  }

  getBitrateDataIdx(endpointId, dataArray) {
    var i = 0, found = false;
    for (; i < dataArray.length; i++)
      if (dataArray[i]['id'] == endpointId) {
        found = true;
        break;
      }
    return (found ? i : -1);
  }

  pollBitrates() {
    this.apiService.getBitrates({
      "restreamId": this.restream['id']
    }).subscribe((newData:any[]) => {
      var dataCopy;
      if (this.bitrateData == undefined) {
        dataCopy = [];
      } else {
        dataCopy = this.bitrateData;
      }

      var curDate:any = new Date();
      curDate = `${curDate.getMinutes()}:${curDate.getSeconds()}`;

      newData.forEach((endpoint) => {
        var whereToInsert = this.getBitrateDataIdx(endpoint.id, dataCopy);
        if (whereToInsert == -1) {
          dataCopy.push({
            data: [ endpoint.out ],
            label: endpoint.name,
            id: endpoint.id
          })
        } else {
          dataCopy[whereToInsert].data.push(endpoint.out);
          if (dataCopy[whereToInsert].data.length > 20) {
            dataCopy[whereToInsert].data.shift()
          }
        }
      });
      
      this.bitrateLabels.push(curDate);
      if (this.bitrateLabels.length > 20) this.bitrateLabels.shift();
      this.bitrateData = dataCopy;

      console.log(this.bitrateLabels)
      console.log(this.bitrateData)
      this.bitrateChart.chart.update();
    })
  }

  ngOnInit() {
    setInterval(this.pollBitrates.bind(this), 1000);
    this.pollBitrates();
  }
}
