export class EventEmitter {
    subscribers: object = {}

    on(event:string, cb) {
        if (!this.subscribers[event])
            this.subscribers[event] = [];

        this.subscribers[event].push(cb);
    }

    emit(event:string, ...data:any[]) {
        if (!this.subscribers[event]) return;
        this.subscribers[event].forEach(cb => {
            cb(...data);
        });
    }
}