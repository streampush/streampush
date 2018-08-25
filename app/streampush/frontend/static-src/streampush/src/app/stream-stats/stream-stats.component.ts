import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ApiService } from '../api.service';
import 'chartjs-plugin-streaming'

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

  public getBrand
  objectValues = Object.values;

  public apiData:object;
  public restreamEvents:any[] = [];

  public bitrateData:Array<any> = [{
    label: 'Inbound Bitrate',
    data: []
  }]

  public bitrateChartOptions = {
    scales: {
      xAxes: [{
          type: 'time'
      }]
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      streaming: {
        onRefresh: null,
        delay: 2000,
        duration: 30 * 1000
      }
    }
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
    this.getBrand = apiService.getBrand
    
    var self = this;
    this.bitrateChartOptions.plugins.streaming.onRefresh = function(chart) {
      self.apiService.getBitrates({
        "restreamId": self.restream['id']
      }).subscribe((newData:object) => {
        self.apiData = newData;

        chart.data.datasets[0].data.push({
          x: Date.now(),
          y: parseFloat(self.apiData["in"])
        });
      })
    }
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

  ngOnInit() {
    this.apiService.on("event", (data) => {
      this.restreamEvents.push(data)
    })
  }
}
