import { OrganizationList } from "@clerk/nextjs"

const OrganizationListPage = () =>{
    return(
        <div>
            <OrganizationList 
            afterCreateOrganizationUrl={"/organization/:id"}
            afterSelectOrganizationUrl={"/organization/:id"}
            hidePersonal
            />
        </div>
    )
}

export default OrganizationListPage