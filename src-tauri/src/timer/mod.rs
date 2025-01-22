use ts_rs::TS;

#[derive(TS)]
#[ts(export)]
enum Hms {
    Hours,
    Minutes,
    Seconds,
}
