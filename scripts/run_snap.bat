@echo off
cd /d %~dp0..
echo Launching screenshot capture...
start /b node scripts/snap.mjs > scripts\snap_run.log 2>&1
echo Done launching. Check scripts\snap.log for progress.
