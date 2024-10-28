package util

import "time"

// TimestampToTime if t==0 return nil
func TimestampToTime(t int64) *time.Time {
	if t <= 0 {
		return nil
	}
	unix := time.Unix(t, 0)
	return &unix
}
