import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const DISTANCES = [
  { value: "1000", text: "1 Kilometer", km: 1 },
  { value: "5000", text: "5 Kilometers", km: 5 },
  { value: "10000", text: "10 Kilometers", km: 10 },
  { value: "21097.5", text: "Half Marathon", km: 21.0975 },
  { value: "42195", text: "Marathon", km: 42.195 },
];

const customNumber = z
  .string()
  .transform((val) => (val === "" ? undefined : parseInt(val, 10)))
  .pipe(z.number({ message: "Please enter a number" }).min(0).optional())
  .or(z.number({ message: "Please enter a number" }).min(0).optional())
  .optional();

const TimeSchema = z.object({
  hours: customNumber,
  minutes: customNumber,
  seconds: customNumber,
});

const DistanceSchema = z.object({
  km: customNumber,
  selectedDistance: z.string().optional(),
});

const PaceSchema = z.object({
  minutes: customNumber,
  seconds: customNumber,
});

const FormSchema = z
  .object({
    time: TimeSchema.optional(),
    distance: DistanceSchema.optional(),
    pace: PaceSchema.optional(),
  })
  .refine(
    (data) => {
      const filledSections = Object.values(data).filter(
        (section) =>
          section !== undefined &&
          Object.values(section).some((val) => val !== undefined)
      ).length;
      return filledSections >= 2;
    },
    {
      message: "At least two sections must be completed",
      path: ["formError"],
    }
  );

type FormData = z.infer<typeof FormSchema>;

export const PaceCalculator = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      time: {
        hours: "" as unknown as number,
        minutes: "" as unknown as number,
        seconds: "" as unknown as number,
      },
      distance: { km: "" as unknown as number, selectedDistance: "" },
      pace: {
        minutes: "" as unknown as number,
        seconds: "" as unknown as number,
      },
    },
  });

  const getTime = (data: FormData) => {
    const distance = data.distance?.km || 0;
    const paceSeconds = data.pace?.seconds || 0;
    const paceMinutes = data.pace?.minutes || 0;

    if (distance && (paceSeconds || paceMinutes)) {
      const paceInSecondsPerKm = paceMinutes * 60 + paceSeconds;
      const totalTimeInSeconds = paceInSecondsPerKm * distance;
      const timeHours = Math.floor(totalTimeInSeconds / 3600);
      const timeMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const timeSeconds = Math.floor(totalTimeInSeconds % 60);

      form.setValue("time.seconds", timeSeconds);
      form.setValue("time.minutes", timeMinutes);
      form.setValue("time.hours", timeHours);
    }
  };

  const getPace = (data: FormData) => {
    const timeSeconds = data.time?.seconds || 0;
    const timeMinutes = data.time?.minutes || 0;
    const timeHours = data.time?.hours || 0;
    const distance = data.distance?.km || 0;

    if (distance && (timeSeconds || timeMinutes || timeHours)) {
      const totalTimeInSeconds =
        timeHours * 3600 + timeMinutes * 60 + timeSeconds;

      const paceInSecondsPerKm = totalTimeInSeconds / distance;

      const paceMinutes = Math.floor(paceInSecondsPerKm / 60);
      const paceSeconds = Math.floor(paceInSecondsPerKm % 60);

      form.setValue("pace.seconds", paceSeconds);
      form.setValue("pace.minutes", paceMinutes);
    }
  };

  const getDistance = (data: FormData) => {
    const timeSeconds = data.time?.seconds || 0;
    const timeMinutes = data.time?.minutes || 0;
    const timeHours = data.time?.hours || 0;

    const paceSeconds = data.pace?.seconds || 0;
    const paceMinutes = data.pace?.minutes || 0;
    if (
      (paceSeconds || paceMinutes) &&
      (timeSeconds || timeMinutes || timeHours)
    ) {
      const totalTimeInSeconds =
        timeHours * 3600 + timeMinutes * 60 + timeSeconds;
      const totalPaceInSeconds = paceMinutes * 60 + paceSeconds;
      const distanceInKm = totalTimeInSeconds / totalPaceInSeconds;
      console.log(distanceInKm, totalTimeInSeconds, totalPaceInSeconds);

      form.setValue("distance.km", parseFloat(distanceInKm.toFixed(2)));
    }
  };

  function onSubmit(data: FormData) {
    const activeElem = document.activeElement;
    if (activeElem && (activeElem as HTMLButtonElement).dataset) {
      const type = (activeElem as HTMLButtonElement).dataset.type;
      switch (type) {
        case "pace":
          getPace(data);
          break;
        case "time":
          getTime(data);
          break;
        case "distance":
          getDistance(data);
          break;
        default:
          break;
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3>Time</h3>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-4 justify-center items-center">
            <FormField
              control={form.control}
              name="time.hours"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input placeholder="Hours" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time.minutes"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input placeholder="Minutes" {...field} />
                  </FormControl>
                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time.seconds"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Seconds</FormLabel>
                  <FormControl>
                    <Input placeholder="Seconds" {...field} />
                  </FormControl>
                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />

            
            <Button type="submit" className="self-end" data-type="time">
              Calculate
            </Button>

          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <h3>Distance</h3>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="distance.km"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>KM</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="KM"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.setValue("distance.selectedDistance", undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distance.selectedDistance"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Select Distance</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedDistance = DISTANCES.find(
                        (d) => d.value === value
                      );
                      if (selectedDistance) {
                        form.setValue("distance.km", selectedDistance.km);
                      }
                    }}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Or select a distance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DISTANCES.map((distance) => (
                        <SelectItem key={distance.value} value={distance.value}>
                          {distance.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-end" data-type="distance">
              Calculate
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <h3>Pace Per KM</h3>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="pace.minutes"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input placeholder="Minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pace.seconds"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Seconds</FormLabel>
                  <FormControl>
                    <Input placeholder="Seconds" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-end" data-type="pace">
              Calculate
            </Button>
          </div>
        </div>
        {/* @ts-ignore */}
        {form.formState.errors.formError && (
          <small className="mt-5 block text-red-500">
            {/* @ts-ignore */}
            {form.formState.errors.formError.message}
          </small>
        )}
      </form>
    </Form>
  );
};
