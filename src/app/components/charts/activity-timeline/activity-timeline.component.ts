import { Component, OnInit } from "@angular/core";
import ApexCharts from "apexcharts";

@Component({
    selector: "app-activity-timeline",
    templateUrl: "./activity-timeline.component.html",
    styleUrls: ["./activity-timeline.component.scss"]
})
export class ActivityTimelineComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        const options = {
            chart: {
                height: 360,
                type: "radialBar"
            },
            legend: {
                show: false
            },
            colors: ["#ea3a3b", "#13bb37", "#4788ff", "#1CD3D2"],
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: "14px",
                            color: "2b2b2b"
                        },
                        value: {
                            fontSize: "20px"
                        },
                        total: {
                            show: true,
                            label: "Total Visitor"
                        }
                    }
                }
            },
            series: [95, 80, 90, 81],
            labels: [
                "Organic Search",
                "Email Campaign",
                "Referral Visitor",
                "Social Media"
            ]
        };
        const chart = new ApexCharts(
            document.querySelector("#activity-timeline-chart"),
            options
        );
        chart.render();
    }
}
