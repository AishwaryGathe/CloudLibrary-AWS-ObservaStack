# **📘 Cloud Library — Modern Full-Stack Observability & Monitoring System**

## **🔎 What This Project Is About**

Cloud Library is a fully deployed **cloud-native monitoring system** built around a real production-style architecture.
The project demonstrates how modern companies monitor:

* Application performance
* Server health
* Resource usage
* Traffic spikes
* Unexpected load patterns
* System failures

It brings together a complete observability stack capable of **collecting metrics**, **evaluating rules**, and **sending real-time alerts** to engineering teams.

This project reflects **actual DevOps/SRE workflows** used in tech companies where visibility, alerting, and reliability are critical.

---

# **🧩 What Services Are Used in This Project**

### **1. AWS EC2**

All components run on EC2 instances:

* Frontend instance
* Backend instance
* Monitoring instance (Prometheus + Alertmanager + Grafana)

EC2 is used because real production environments rely on persistent servers for app + monitoring workloads.

---

### **2. Prometheus**

Prometheus is the **metrics collection engine**.

It continuously scrapes metrics from:

* Node Exporter (system metrics)
* Backend service (application-level metrics)
* Its own internal metrics

It also evaluates rules like:

* High CPU usage
* Excessive page hits
* Instance health
* Unexpected spikes

Prometheus is the **brain** of the entire system.

---

### **3. Alertmanager**

Alertmanager handles:

* Routing alerts
* Broadcasting them to Slack
* Grouping related alerts
* Avoiding duplicate notifications

This is exactly how real DevOps teams get notified when something goes wrong in production.

---

### **4. Node Exporter**

Installed on:

* Frontend EC2
* Backend EC2
* Monitoring EC2

Node Exporter provides **deep system-level metrics**, including:

* CPU usage
* Memory usage
* Disk read/write
* Network throughput
* Hardware stats

This mirrors production setups where infra-level visibility is mandatory.

---

### **5. Slack Incoming Webhooks**

Used to **send real-time alert notifications** to a Slack channel.

This represents real-world DevOps workflows where teams receive:

* High CPU alerts
* Application error spikes
* System outages
* Sudden load increases

Slack is used here because almost every engineering team uses it for on-call alerting.

---

### **6. Grafana (Optional)**

Grafana acts as the **visual dashboarding layer**, helping teams see:

* CPU graphs
* Memory consumption
* Application traffic
* Page hit metrics
* System trends over time

In production, dashboards are essential for decision-making.

---

# **🏗 Real-Life Scenarios Simulated in This Project**

### **📌 1. CPU Spike / Server Overload**

If CPU usage crosses the defined threshold for a sustained period, an alert fires.

Real-world use case:

* Protecting backend from overload
* Detecting infinite loops, heavy queries, or DDoS attempts
* Ensuring auto-scaling decisions are made with visibility

---

### **📌 2. Sudden Traffic Spike (Page Hits Alert)**

The backend exposes a custom Prometheus metric tracking page hits.
If someone hits the page rapidly (bot or aggressive traffic), an alert triggers.

Real-world use case:

* Detect abusive traffic
* Identify marketing spikes or bot activity
* Trigger autoscaling
* Prevent service degradation

---

### **📌 3. Infrastructure Health Monitoring**

Node Exporter monitors:

* CPU saturation
* Disk nearing full capacity
* High memory consumption
* Network bottlenecks

Real-world use case:

* Prevent crashes
* Detect failing hardware
* Catch early performance regressions

---

### **📌 4. Multi-Instance Auto Discovery (AWS EC2 Discovery)**

Prometheus automatically detects EC2 instances with a specific tag like `Role = backend`.

This replicates:

* Auto-scaling groups
* Blue/green deployments
* Rolling updates
* Dynamic workloads

No need to manually update IPs.

---

### **📌 5. Centralized Monitoring Server**

A dedicated Monitoring EC2 runs:

* Prometheus
* Alertmanager
* Node Exporter
* (Optional) Grafana

This mirrors how real SRE teams operate with a **central monitoring hub**.

---

### **📌 6. Slack Alerting Workflow**

Alerts are pushed directly into a Slack channel.

This simulates:

* On-call engineer workflows
* Production alerting
* Real-time issue triage
* Post-incident notifications

---

# **🌐 High-Level Architecture**

```
                    ┌──────────── Slack Alerts ────────────┐
                    │                                        │
                    ▼                                        │
            ┌──────────────────┐        Fires Alerts   ┌──────────────┐
            │  Alertmanager     │ <──────────────────── │  Prometheus  │
            └──────────────────┘                        └──────────────┘
                        ▲                                      ▲
                        │ Scrapes Metrics                      │
        ┌───────────────┼────────────────────┬────────────────┼───────────────┐
        │               │                    │                │               │
┌─────────────┐  ┌─────────────┐     ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│Frontend EC2 │  │Backend EC2  │     │Backend App  │   │Node Exporter │   │Grafana (Opt.)│
│NodeExporter │  │NodeExporter │     │/metrics      │   │(Monitoring)  │   │Dashboards    │
└─────────────┘  └─────────────┘     └─────────────┘   └──────────────┘   └──────────────┘
```

---

# **🎯 Why This Project Matters**

This project simulates **exactly how modern DevOps, SRE, and Infrastructure teams monitor production systems**.

It teaches:

* How to build a production-grade monitoring pipeline
* How alerts travel from metrics → Prometheus → Alertmanager → Slack
* How to monitor CPU, memory, app usage, and custom business metrics
* How to use EC2 auto discovery instead of hardcoding IPs
* How to design for reliability, observability, and scalability

This is the type of setup used at:

* SaaS companies
* Fintech startups
* Large enterprises
* Any system with real-time monitoring needs

---

# **🏁 Final Notes**

This README gives a complete **conceptual and architectural understanding** of the entire monitoring stack:

✔ What we are doing
✔ Why we are doing it
✔ Which real-life scenarios it solves
✔ What services are involved
✔ How each component fits in the bigger picture


