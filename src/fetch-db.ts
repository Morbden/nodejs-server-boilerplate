interface DBResponse<T = any, S extends string = 'OK'> {
  time: string
  status: S
  result: T extends [] ? T : T[]
}

interface DBError {
  code: number
  details: string
  description: string
  information: string
}

const DBUrl = 'http://127.0.0.1:8000/sql'

const DBBasicAuth = Buffer.from(`root:root`).toString('base64')

export const fetchDB = async <T = any>(query: string, projectId?: string) => {
  try {
    const res = await fetch(DBUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${DBBasicAuth}`,
        NS: projectId ? 'fluidocms' : 'root',
        DB: projectId || 'root',
      },
      body: query,
    })

    const text = await res.text()

    const json = JSON.parse(text)
    if (res.ok && Array.isArray(json)) {
      return json as DBResponse<T, 'OK'>[]
    } else {
      console.error(json)
      return [
        {
          time: '0',
          status: 'ERROR',
          result: [json],
        },
      ] as [DBResponse<[DBError], 'ERROR'>]
    }
  } catch (error) {
    return [
      {
        time: '0',
        status: 'ERROR',
        result: [error],
      },
    ] as [DBResponse<[any], 'ERROR'>]
  }
}
