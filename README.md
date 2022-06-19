# Storage

-   A simple orm framework base on localstorage

## Usage

npm i @sutext/storage

## Example

```ts
import orm from "@sutext/storage";
const { Entity, Field } = orm;
@Entity("NSUser", "id")
class User {
    id: string;
    name: string;
    constructor(json?: any) {
        if (json != null) {
            this.id = json["id"];
            this.name = json["jack"];
        }
    }
}
@Entity("NSStudent", "id")
class Student {
    id: string;
    stdid: string;
    @Field(User)
    user: User;
    constructor(json?: any) {
        if (json != null) {
            this.id = json["id"];
            this.stdid = json["stdid"];
        }
    }
}

const user = new User({ id: 1 });
user.name = "Tom";
const student = new Student({ id: "1" });
student.stdid = "1";
student.user = user;
console.log(student);
orm.save(student);
console.log(orm.find(Student, "1"));
```
